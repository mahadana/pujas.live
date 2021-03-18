import isMobile from "ismobilejs";
import _castArray from "lodash/castArray";
import _isEqual from "lodash/isEqual";
import _isFinite from "lodash/isFinite";
import _isObject from "lodash/isObject";
import _merge from "lodash/merge";
import _pick from "lodash/pick";

import { getMediaPlayerSingleton } from "@/components/chanting/ChantMediaPlayer";
import {
  bindInteger,
  createChantMappings,
  getIndexInterPosition,
  getIndexInterTime,
  getIndexPositionFromTime,
  getIndexTimeFromPosition,
  interpolateTiming,
  makeLoop,
  normalizeDimension,
  normalizeTiming,
  orderDimension,
  staggerRowsInDimension,
  scale,
} from "@/lib/chanting";

// Known issues on iOS:
//
// 1. When there is some DOM manipulations, iOS will break out of a touch
//    drag/scroll. An example would be to touch to bring up the controls, wait
//    for the controls to disappear, then to start dragging. There doesn't seem
//    to be any workarounds at the moment.
//
// 2. After a touch momentum scroll, if the scrollTo during playing start too
//    quickly, it results in scroll stuttering. This is the reason for
//    TIMEOUT_RELEASE_SLOW. Similarly, there doesn't seem to be any workarounds
//    at the moment.

const DEFAULT_FONT_SIZE = 20; // 20px
const MID_VIEW_RATIO = 0.5; // middle of window
const NEAR_TIME = 1; // 1 second
const FAR_TIME = 20; // 20 seconds

const STATE_POLLING = 0; // Polling to detect when the DOM is ready
const STATE_REFLOW = 1; // Perform setup and wait for reflow to get accurate dimensions
const STATE_SCROLLING = 2; // Normal scrolling state (both playing and paused)
const STATE_CATCHUP = 3; // Like STATE_SCROLLING but with higher acceleration, follows STATE_RELEASE
const STATE_TOUCH = 4; // Touch detected, don't scroll but keep updating dim.scrollTop
const STATE_MOVE = 5; // Touch move detected
const STATE_RELEASE = 6; // Touch release, keep observing scroll events

const STATE_REMOVED = 0;
const STATE_HIDDEN = 1;
const STATE_VISIBLE = 2;

const TIMEOUT_REFLOW = 20; // 0.33 seconds
const TIMEOUT_ACCELERATION = 60 * 2; // 2 seconds
const TIMEOUT_ACCELERATION_CATCHUP = 20; // 0.33 seconds
const TIMEOUT_CONTROLS = 30; // 0.5 seconds -- fade in/out time
const TIMEOUT_CONTROLS_IDLE = TIMEOUT_CONTROLS + 60 * 3; // 3 seconds -- idle time before fade out
const TIMEOUT_CATCHUP = 30; // 0.5 seconds
const TIMEOUT_FULLSCREEN = 60; // 1 second -- interval to check fullscreen
const TIMEOUT_TOUCH = 30; // 0.5 seconds
const TIMEOUT_MOVE = 60 * 3; // 3 seconds
const TIMEOUT_RELEASE = 6; // 0.1 seconds
const TIMEOUT_RELEASE_SCROLL = 3; // 0.05 seconds -- quicker play after touch scrolling
const TIMEOUT_RELEASE_SLOW = 15; // 0.25 seconds -- longer timeout for iOS due quirks in touch scrolling
const TIMEOUT_SETTINGS = 15; // 0.25 seconds -- fade in/out time

let _chantSetId = 0;

class ChantScrollerModel {
  constructor() {
    this.containerEl = null;
    this.debugEl = null;
    this.scrollerEl = null;
    this.dispatch = () => undefined;
    this.state = { fontSize: DEFAULT_FONT_SIZE };
    this.isMobile = isMobile(window.navigator);
    this.mediaPlayer = getMediaPlayerSingleton();
    this.reset();
    this.loop = makeLoop(this._loop.bind(this));
    [
      "Click",
      "KeyDown",
      "MouseMove",
      "TouchCancel",
      "TouchEnd",
      "TouchMove",
      "TouchStart",
      "Wheel",
      "Scroll",
    ].forEach((event) => {
      const method = `_on${event}`;
      this[method] = this[method].bind(this);
    });
  }

  attach(containerEl) {
    const getElement = (className) => {
      const el = containerEl?.getElementsByClassName?.(className)?.[0];
      if (!el) throw new Error(`Could not get ${className} element`);
      return el;
    };
    const scrollerEl = getElement("chant-scroller");
    const debugEl = getElement("chant-debug");
    this.detach();
    document.addEventListener("click", this._onClick);
    document.addEventListener("keydown", this._onKeyDown);
    document.addEventListener("mousemove", this._onMouseMove);
    containerEl.classList.add("chant-controls-removed");
    containerEl.classList.add("chant-settings-removed");
    this.containerEl = containerEl;
    const p = { passive: true };
    scrollerEl.addEventListener("scroll", this._onScroll);
    scrollerEl.addEventListener("touchcancel", this._onTouchCancel, p);
    scrollerEl.addEventListener("touchend", this._onTouchEnd, p);
    scrollerEl.addEventListener("touchmove", this._onTouchMove, p);
    scrollerEl.addEventListener("touchstart", this._onTouchStart, p);
    scrollerEl.addEventListener("wheel", this._onWheel, p);
    scrollerEl.style.setProperty("font-size", this.state.fontSize + "px");
    this.scrollerEl = scrollerEl;
    this.debugEl = debugEl;
    this.mediaPlayer.attach();
    this.loop.start();
  }

  detach() {
    document.removeEventListener("click", this._onClick);
    document.removeEventListener("keydown", this._onKeyDown);
    document.removeEventListener("mousemove", this._onMouseMove);
    if (this.containerEl) {
      this.containerEl.classList.remove("chant-controls-hidden");
      this.containerEl.classList.remove("chant-controls-removed");
      this.containerEl.classList.remove("chant-controls-visible");
      this.containerEl.classList.remove("chant-settings-hidden");
      this.containerEl.classList.remove("chant-settings-removed");
      this.containerEl.classList.remove("chant-settings-visible");
    }
    this.containerEl = null;
    const scrollerEl = this.scrollerEl;
    if (scrollerEl) {
      const p = { passive: true };
      scrollerEl.removeEventListener("scroll", this._onScroll);
      scrollerEl.removeEventListener("touchcancel", this._onTouchCancel, p);
      scrollerEl.removeEventListener("touchend", this._onTouchEnd, p);
      scrollerEl.removeEventListener("touchmove", this._onTouchMove, p);
      scrollerEl.removeEventListener("touchstart", this._onTouchStart, p);
      scrollerEl.removeEventListener("wheel", this._onWheel, p);
      scrollerEl.style.removeProperty("font-size");
    }
    this.scrollerEl = null;
    this.debugEl = null;
    this.mediaPlayer.detach();
    this.loop.stop();
  }

  getDefaultMaximize() {
    return Boolean(this.isMobile.phone);
  }

  hasFullScreen() {
    return (
      !this.isMobile.apple.phone &&
      !(this.state.parentFullScreen && this.getDefaultMaximize())
    );
  }

  reset() {
    this.chantSet = null;
    this.controlsState = STATE_REMOVED;
    this.controlsTimeout = 0;
    this.dim = null;
    this.fullScreenMode = false;
    this.fullScreenTimeout = 0;
    this.initialChantIndex = null;
    this.lastTimestamp = null;
    this.mediaStamp = null;
    this.scrollState = STATE_POLLING;
    this.scrollTimeout = 0;
    this.settingsState = STATE_REMOVED;
    this.settingsTimeout = 0;
    this.time = 0;
    this.useMediaPlayer = false;
    this.velocity = 0;
    this.windowStamp = null;
    this.mediaPlayer.reset();
    this._resetActive();
  }

  setDispatch(dispatch) {
    this.dispatch = dispatch;
  }

  setState(state, chantSetCallback) {
    const reload =
      this.state.chantData !== state.chantData ||
      this.state.chantSet !== state.chantSet;
    this.state = state;
    if (reload) {
      this.reset();
      if (state.chantData && state.chantSet) {
        this._initializeChantSet();
      } else {
        this.chantSet = null;
      }
      chantSetCallback?.(this.chantSet);
    }
  }

  _getDimensions() {
    const dim = {
      scrollTop: this.scrollerEl.scrollTop,
      scrollHeight: this.scrollerEl.scrollHeight,
      clientHeight: this.scrollerEl.clientHeight,
      chants: [],
    };
    let chantIndex = 0;
    for (const chant of this.chantSet.chants) {
      const chantEl = document.getElementById(chant.domId);
      if (!chantEl) {
        throw new Error(`Could not find chant element ${chant.domId}`);
      }
      const chantTop = chantEl.offsetTop;
      const chantDim = {
        index: chantIndex,
        top: chantTop,
        bottom: chantTop + chantEl.offsetHeight,
        nodes: [],
      };

      let nodeIndex = 0;
      for (const node of chant.nodes) {
        const nodeEl = document.getElementById(node.domId);
        if (!nodeEl) {
          throw new Error(`Could not find node element ${node.domId}`);
        }
        const nodeTop = nodeEl.offsetTop;
        chantDim.nodes.push({
          index: nodeIndex,
          top: nodeTop,
          bottom: nodeTop + nodeEl.offsetHeight,
        });
        nodeIndex += 1;
      }
      dim.chants.push(chantDim);
      chantIndex += 1;
    }
    return dim;
  }

  _getEstimatedCharCount(html) {
    return String(html ?? "")
      .replace(/<[^>]*>/g, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[-]/g, " ")
      .replace(/[^\sa-zA-Z0-9]/g, "")
      .replace(/\s+/g, " ")
      .trim().length;
  }

  _getEstimatedNodeDuration(node) {
    let duration;
    if (node.type === "verse") {
      const charCount = this._getEstimatedCharCount(node.html);
      if (node.lang == "pi" || String(node.html).match(/[āīūḷṇṃḍṭṅñ]/)) {
        duration = 0.7 + 0.14 * charCount;
      } else {
        duration = 1.2 + 0.07 * charCount;
      }
    } else {
      duration = 1;
    }
    return parseFloat(duration.toFixed(1));
  }

  _getEstimatedTiming(chantNodes) {
    let total = 1;
    const nodes = chantNodes.map((node) => {
      const duration = this._getEstimatedNodeDuration(node);
      const start = total;
      const end = (total = parseFloat((total + duration).toFixed(1)));
      return { index: node.index, start, end };
    });
    return { start: 0, end: total + 1, nodes };
  }

  _getMediaUrl() {
    return (
      this.chantSet?.chants?.[this.activeChantIndex]?.timing?.mediaUrl ?? null
    );
  }

  _getMediaPlayerTime() {
    if (this.useMediaPlayer) {
      const chantIndex = this.activeChantIndex;
      if (_isFinite(chantIndex)) {
        const chantDim = this.dim.chants[chantIndex];
        if (chantDim) {
          return this.mediaPlayer.getTime() + chantDim.timeOffset;
        }
      }
    }
    return null;
  }

  _getMidPosition() {
    return parseInt((this.dim?.clientHeight ?? 0) * MID_VIEW_RATIO);
  }

  _getPositionFromTime(time) {
    const chantDims = this.dim.chants;
    const chantCount = chantDims.length;
    const chantSetDim = { ...this.dim, nodes: chantDims };
    const [, chantIndex, perc] = getIndexInterTime(chantSetDim, time);

    if (chantCount === 0) {
      const pos = scale(perc, 0, 1, this.dim.top, this.dim.bottom);
      return [pos, null, null];
    } else if (chantIndex >= chantCount) {
      const lastBottom = chantDims[chantCount - 1].bottom;
      const pos = scale(perc, 0, 1, lastBottom, this.dim.bottom);
      return [pos, chantCount - 1, null];
    } else {
      const chantDim = chantDims[chantIndex];
      const [nodeIndex, pos] = getIndexPositionFromTime(chantDim, time);
      return [pos, chantIndex, nodeIndex];
    }
  }

  _getRelativeTime() {
    const chantIndex = this.activeChantIndex;
    if (_isFinite(chantIndex)) {
      const chantDim = this.dim.chants[chantIndex];
      if (chantDim) {
        return this.time - chantDim.timeOffset;
      }
    }
    return null;
  }

  _getTimeFromPosition(pos) {
    const chantDims = this.dim.chants;
    const chantCount = chantDims.length;
    const chantSetDim = { ...this.dim, nodes: chantDims };
    let [, chantIndex, perc] = getIndexInterPosition(chantSetDim, pos);

    if (chantCount === 0) {
      const time = scale(perc, 0, 1, this.dim.start, this.dim.end);
      return [time, time];
    }
    if (chantIndex >= chantCount) chantIndex = chantCount - 1;
    const chantDim = chantDims[chantIndex];
    const [, time] = getIndexTimeFromPosition(chantDim, pos);
    const mediaTime = time - chantDim.timeOffset;
    return [time, mediaTime];
  }

  _initializeChantSet() {
    const { chantIds, link, title } = this.state.chantSet;
    const chantSetDomId = `chant-id-${_chantSetId++}`;
    this.initialChantIndex = null;

    const chants = _castArray(chantIds)
      .map((chantId) => this.state.chantData?.chantMap?.[chantId])
      .filter(_isObject)
      .map((chant, index) => {
        if (chant.id === link) this.initialChantIndex = index;
        const domId = `${chantSetDomId}-${index}`;
        const { form, nodes } = createChantMappings(chant);
        nodes.forEach((node) => (node.domId = `${domId}-${node.index}`));

        let timing = this.state.chantData?.timingMap?.[chant.id];
        if (timing) {
          timing = normalizeTiming(timing, nodes.length);
          timing = interpolateTiming(timing);
        } else {
          console.log(`${chant.id} timing not found, using estimate`);
          timing = this._getEstimatedTiming(nodes);
        }

        return { index, id: chant.id, domId, nodes, timing, form };
      });

    this.chantSet = { chants, domId: chantSetDomId, title };
  }

  _initializeDimensions() {
    const norm = (time) => parseFloat(time.toFixed(1));
    let cumulativeOffset = 0;
    const dim = this._getDimensions();
    dim.chants = dim.chants
      .map(normalizeDimension)
      .map(staggerRowsInDimension)
      .map(orderDimension)
      .map((chantDim, chantIndex) => {
        const timing = this.chantSet.chants[chantIndex].timing;
        if (!timing || chantDim.nodes.length !== timing.nodes.length) {
          throw new Error("Unexpected timing / length");
        }
        const timeOffset = norm(cumulativeOffset - timing.start);
        const adjTimingNodes = timing.nodes.map(({ start, end }) => ({
          start: norm(start + timeOffset),
          end: norm(end + timeOffset),
        }));
        const adjChantDim = {
          ..._pick(chantDim, ["top", "bottom"]),
          start: norm(timing.start + timeOffset),
          end: norm(timing.end + timeOffset),
          timeOffset,
          nodes: _merge(chantDim.nodes, adjTimingNodes),
        };
        cumulativeOffset = norm(cumulativeOffset + timing.end - timing.start);
        return adjChantDim;
      });

    this.dim = {
      scrollTop: bindInteger(dim.scrollTop, 0),
      scrollHeight: bindInteger(dim.scrollHeight, 0),
      clientHeight: bindInteger(dim.clientHeight, 0),
      top: dim.chants[0]?.top ?? 0,
      bottom: dim.chants[dim.chants.length - 1]?.bottom ?? 0,
      start: 0,
      end: cumulativeOffset,
      chants: dim.chants,
    };
  }

  _isSlowScroll() {
    return Boolean(this.isMobile.apple.device || this.isMobile.other.firefox);
  }

  _loop() {
    if (this.scrollState === STATE_POLLING) {
      this._loopPoll();
    } else if (this.scrollState === STATE_REFLOW) {
      this._loopReflow();
    } else {
      this._loopUpdateWindow();
      this._loopUpdateTime();
      this._loopUpdateActive();
      this._loopUpdateState();
      this._loopUpdateVelocity();
      this._loopScroll();
      this._loopUpdateUseMedia();
      this._loopUpdatePlayMedia();
    }
    this._loopUpdateFullScreen();
    this._loopUpdateControls();
    this._loopUpdateSettings();
    this._loopUpdateDebug();
  }

  _loopPoll() {
    if (this.scrollerEl) {
      this.scrollerEl.style.setProperty("opacity", "0");
      this.scrollerEl.style.setProperty("overflow-y", "hidden");
      this.scrollerEl.style.setProperty("visibility", "hidden");
    }
    const domId = this.chantSet?.domId;
    if (domId) {
      const el = document.getElementById(this.chantSet.domId);
      if (this.scrollerEl && el) {
        this.scrollState = STATE_REFLOW;
        this.scrollTimeout = TIMEOUT_REFLOW;
      }
    }
  }

  _loopReflow() {
    if (this.scrollTimeout > 0) {
      if (this.scrollTimeout === TIMEOUT_REFLOW || this.scrollTimeout === 1) {
        // We do this twice because for some reason, the initial reflow
        // doesn't always accurately assign the offsets.
        this._initializeDimensions();
        this._scrollToInitialChant();
      }
      this.scrollTimeout -= 1;
    } else {
      this.scrollerEl.style.setProperty("opacity", "1");
      this.scrollerEl.style.removeProperty("overflow-y");
      this.scrollerEl.style.removeProperty("visibility");
      this.scrollerEl.focus();
      this.scrollState = STATE_SCROLLING;
      this._setTimeFromCurrentPosition();
      this._loopUpdateVelocity();
      this._loopScroll();
      this._loopUpdateActive();
      this._loopUpdateUseMedia();
      this._loopUpdatePlayMedia();
    }
  }

  _loopScroll() {
    if (
      this.state.playing &&
      (this.scrollState === STATE_SCROLLING ||
        this.scrollState === STATE_TOUCH ||
        this.scrollState === STATE_CATCHUP)
    ) {
      const top = this.dim.scrollTop + this.velocity / 60;
      this.dim.scrollTop = top;
      if (
        this.scrollState === STATE_SCROLLING ||
        this.scrollState === STATE_CATCHUP
      ) {
        this.scrollerEl.scrollTo({ left: 0, top });
      }
    }
  }

  _loopUpdateActive() {
    if (
      this.scrollState !== STATE_SCROLLING &&
      this.scrollState !== STATE_CATCHUP
    ) {
      this._resetActive();
      return;
    }

    const time = this.time;
    const [, chantIndex, nodeIndex] = this._getPositionFromTime(time);

    if (
      chantIndex !== this.activeChantIndex ||
      nodeIndex !== this.activeIndex
    ) {
      this._resetActive();
      this.activeChantIndex = chantIndex;
      this.activeIndex = nodeIndex;
      if (_isFinite(chantIndex) && _isFinite(nodeIndex)) {
        const nodes = this.chantSet.chants[chantIndex].nodes;
        this.activeEl = document.getElementById(nodes[nodeIndex].domId);
        this.activeEl.classList.add("chant-active");
      }
    }
  }

  _loopUpdateControls() {
    const { containerEl, controlsState, controlsTimeout, state } = this;
    const classList = containerEl.classList;
    if (controlsTimeout === 0 && !state.settings) {
      if (controlsState === STATE_VISIBLE) {
        classList.remove("chant-controls-visible");
        classList.add("chant-controls-hidden");
        this.controlsState = STATE_HIDDEN;
        this.controlsTimeout = TIMEOUT_CONTROLS;
      } else if (controlsState === STATE_HIDDEN) {
        classList.remove("chant-controls-hidden");
        classList.add("chant-controls-removed");
        this.controlsState = STATE_REMOVED;
        this.controlsTimeout = 0;
        this.scrollerEl.focus();
      }
    } else if (controlsTimeout <= TIMEOUT_CONTROLS && !state.settings) {
      if (controlsState === STATE_VISIBLE) {
        classList.remove("chant-controls-visible");
        classList.add("chant-controls-hidden");
      } else if (controlsState === STATE_REMOVED) {
        classList.remove("chant-controls-removed");
        classList.add("chant-controls-hidden");
      }
      this.controlsState = STATE_HIDDEN;
      this.controlsTimeout -= 1;
    } else {
      if (controlsState === STATE_HIDDEN) {
        classList.remove("chant-controls-hidden");
        classList.add("chant-controls-visible");
        this.controlsState = STATE_VISIBLE;
      } else if (controlsState === STATE_REMOVED) {
        classList.remove("chant-controls-removed");
        classList.add("chant-controls-hidden");
        this.controlsState = STATE_HIDDEN;
      }
      if (state.settings) {
        this.controlsTimeout = TIMEOUT_CONTROLS_IDLE;
      } else {
        this.controlsTimeout -= 1;
      }
    }
  }

  _loopUpdateSettings() {
    const { containerEl, settingsState, settingsTimeout, state } = this;
    const classList = containerEl.classList;
    if (state.settings) {
      if (settingsState === STATE_REMOVED) {
        classList.remove("chant-settings-removed");
        classList.add("chant-settings-hidden");
        this.settingsState = STATE_HIDDEN;
        this.settingsTimeout = 0;
      } else if (settingsState === STATE_HIDDEN) {
        classList.remove("chant-settings-hidden");
        classList.add("chant-settings-visible");
        this.settingsState = STATE_VISIBLE;
        this.settingsTimeout = 0;
      } else {
        if (settingsTimeout < TIMEOUT_SETTINGS) {
          this.settingsTimeout += 1;
        }
      }
    } else {
      if (settingsState === STATE_VISIBLE) {
        classList.remove("chant-settings-visible");
        classList.add("chant-settings-hidden");
        this.settingsState = STATE_HIDDEN;
      } else if (settingsState === STATE_HIDDEN) {
        if (settingsTimeout <= 0) {
          classList.remove("chant-settings-hidden");
          classList.add("chant-settings-removed");
          this.settingsState = STATE_REMOVED;
          this.settingsTimeout = 0;
        } else {
          this.settingsTimeout -= 1;
        }
      }
    }
  }

  _loopUpdateDebug() {
    const code =
      (this.useMediaPlayer ? "M" : "T") +
      this.mediaPlayer.getStateCode() +
      String(this.scrollState);
    const st = String(this.scrollTimeout).padStart(3, "0");
    const ct = String(this.controlsTimeout).padStart(3, "0");
    const tt = String(this.settingsTimeout).padStart(2, "0");
    const ci = `${this.activeChantIndex ?? "--"}`.padStart(2, "0");
    const ni = `${this.activeIndex ?? "--"}`.padStart(2, "0");
    const t = this.time.toFixed(1).padStart(6, "0");
    const y = (this.dim?.scrollTop ?? 0).toFixed(1).padStart(7, "0");
    const v = this.velocity.toFixed(1).padStart(4, "0");
    const loopValue = (value) =>
      Math.min(9999, value).toFixed(0).padStart(4, "0");
    const transformElapsed = (v) => Math.max(0, (v - 1050 / 60) * 10);
    const se = loopValue(transformElapsed(this.loop.elapsed));
    const sd = loopValue(this.loop.duration * 1000);
    const me = loopValue(transformElapsed(this.mediaPlayer.loop.elapsed));
    const md = loopValue(this.mediaPlayer.loop.duration * 1000);
    const file = (this.mediaPlayer.getUrl() ?? "").split("/").splice(-1)[0];
    this.debugEl.innerText =
      `${code}:${st}:${ct}:${tt} ${ci}/${ni} t=${t} y=${y} v=${v} ` +
      `s=${se}/${sd} m=${me}/${md} ${file}`;
    this.debugEl.style.display = this.state.diagnostics ? "block" : "none";
  }

  _loopUpdateFullScreen() {
    if (this.state.parentFullScreen) {
      if (this.state.fullScreen) {
        if (!this.state.maximize) {
          this.dispatch({ type: "SET_MAXIMIZE", maximize: true });
          this.state.maximize = true; // do not wait for React
        }
      } else {
        if (this.state.maximize && !this.getDefaultMaximize()) {
          this.dispatch({ type: "SET_MAXIMIZE", maximize: false });
          this.state.maximize = false; // do not wait for React
        }
      }
      return;
    }
    const fullScreenMode =
      document.fullScreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreen;
    if (this.state.fullScreen) {
      if (!fullScreenMode && this.fullScreenTimeout === 0) {
        if (this.fullScreenMode) {
          this.fullScreenMode = false;
          this.fullScreenTimeout = TIMEOUT_FULLSCREEN;
          this.dispatch({ type: "SET_FULL_SCREEN", fullScreen: false });
          this.state.fullScreen = false; // do not wait for React
        } else {
          this.fullScreenMode = true;
          this.fullScreenTimeout = TIMEOUT_FULLSCREEN;
          this.containerEl
            .requestFullscreen()
            .then(() => {
              this.scrollerEl.focus();
            })
            .catch(console.error);
        }
      }
    } else {
      if (fullScreenMode && this.fullScreenTimeout === 0) {
        this.fullScreenMode = false;
        this.fullScreenTimeout = TIMEOUT_FULLSCREEN;
        document
          .exitFullscreen()
          .then(() => {
            this.scrollerEl.focus();
          })
          .catch(console.error);
      }
    }
    if (this.fullScreenTimeout > 0) {
      this.fullScreenTimeout -= 1;
    }
  }

  _loopUpdatePlayMedia() {
    if (
      this.useMediaPlayer &&
      (this.scrollState === STATE_SCROLLING ||
        this.scrollState === STATE_CATCHUP)
    ) {
      const mpState = this.mediaPlayer.state;
      if (this.state.playing) {
        if (mpState === "ENDED") {
          this.dispatch({ type: "STOP_PLAYING" });
          this.state.playing = false; // do not wait for React
        } else {
          this.mediaPlayer.play();
        }
      } else if (!this.state.playing) {
        if (mpState === "PLAYING" || mpState === "ENDED") {
          this.mediaPlayer.stop();
        }
      }
      if (_isFinite(this.state.speed)) {
        this.mediaPlayer.setPlaybackRate(this.state.speed);
      }
      this.mediaPlayer.setVolume(this.state.audio ? 1 : 0);
    }
  }

  _loopUpdateState() {
    if (this.scrollTimeout > 0) {
      this.scrollTimeout -= 1;
      if (this.scrollTimeout <= 0) {
        switch (this.scrollState) {
          case STATE_TOUCH:
            this._setStateMove();
            break;
          case STATE_MOVE:
          case STATE_RELEASE:
            this.scrollState = STATE_CATCHUP;
            this.scrollTimeout = TIMEOUT_CATCHUP;
            this.velocity = 0;
            this.dim.scrollTop = this.scrollerEl.scrollTop;
            this._setTimeFromCurrentPosition();
            break;
          default:
            this.scrollState = STATE_SCROLLING;
            this.scrollTimeout = 0;
            break;
        }
      }
    }
  }

  _loopUpdateUseMedia() {
    const { scrollState } = this;
    if (
      scrollState === STATE_TOUCH ||
      scrollState === STATE_MOVE ||
      scrollState === STATE_RELEASE
    ) {
      return;
    }

    const chantIndex = this.activeChantIndex;
    const mediaUrl = this._getMediaUrl();
    const mediaStamp = {
      chantIndex,
      mediaUrl,
      start: this.dim.chants[this.activeChantIndex]?.start ?? null,
      end: this.dim.chants[this.activeChantIndex]?.end ?? null,
    };

    if (mediaUrl) {
      if (mediaStamp.chantIndex !== this.mediaStamp?.chantIndex) {
        this.mediaPlayer.setUrl(mediaUrl);
        if (
          mediaStamp.mediaUrl !== this.mediaStamp?.mediaUrl ||
          mediaStamp.start !== this.mediaStamp?.end
        ) {
          this.mediaPlayer.setTime(this._getRelativeTime() ?? 0);
          // ensure subsequent calls to getTime are good
          this.mediaPlayer.preload();
        }
      }
      this.useMediaPlayer = true;
    } else {
      if (this.useMediaPlayer) {
        this.mediaPlayer.stop();
      }
      this.useMediaPlayer = false;
    }
    this.mediaStamp = mediaStamp;
  }

  _loopUpdateTime() {
    const mediaPlayerTime = this._getMediaPlayerTime();
    if (_isFinite(mediaPlayerTime)) {
      this.time = mediaPlayerTime;
    } else if (this.state.playing) {
      const elapsed =
        this.loop.timestamp - this.lastTimestamp ?? this.loop.timestamp;
      this.time += (elapsed * (this.state.speed ?? 1)) / 1000;
    }
    this.lastTimestamp = this.loop.timestamp;

    if (this.time >= this.dim.end && this.state.playing) {
      this.dispatch({ type: "STOP_PLAYING" });
      this.state.playing = false; // do not wait for React
      this.time = this.dim.end;
    }
  }

  _loopUpdateVelocity() {
    const time = this.time;
    const [position] = this._getPositionFromTime(time);
    const [nearPosition] = this._getPositionFromTime(time + NEAR_TIME);
    const [farPosition] = this._getPositionFromTime(time + FAR_TIME);

    const mid = this._getMidPosition();
    const scrollTop = this.dim.scrollTop;
    const diff = position - mid - scrollTop;
    const diffRatio = (Math.abs(diff) * 2) / this.dim.clientHeight;
    const ratio = Math.min(diffRatio, 1) ** 2;

    const speed = this.state.speed ?? 1;
    const nearVelocity = (nearPosition - mid - scrollTop) / (NEAR_TIME / speed);
    const farVelocity = (farPosition - mid - scrollTop) / (FAR_TIME / speed);
    const targetVelocity = farVelocity * (1 - ratio) + nearVelocity * ratio;
    const timeout =
      this.scrollState === STATE_CATCHUP
        ? TIMEOUT_ACCELERATION_CATCHUP
        : TIMEOUT_ACCELERATION;

    this.velocity = (this.velocity * (timeout - 1) + targetVelocity) / timeout;
  }

  _loopUpdateWindow() {
    const windowStamp = [window.innerWidth, window.innerHeight];
    let reload =
      Boolean(this.windowStamp) && !_isEqual(windowStamp, this.windowStamp);
    this.windowStamp = windowStamp;

    const fontSizeValue = this.state.fontSize + "px";
    if (this.scrollerEl.style.getPropertyValue("font-size") !== fontSizeValue) {
      this.scrollerEl.style.setProperty("font-size", fontSizeValue);
      reload = true;
    }

    if (reload) {
      this._initializeDimensions();
      const [position] = this._getPositionFromTime(this.time);
      this._scrollToPosition(position);
      this.velocity = 0;
    }
  }

  _onClick() {
    this._showControls();
  }

  _onKeyDown(event) {
    const keyTypeMap = {
      arrowdown: "scroll",
      arrowleft: "DECREASE_SPEED",
      arrowright: "INCREASE_SPEED",
      arrowup: "scroll",
      end: "scroll",
      home: "scroll",
      pageup: "scroll",
      pagedown: "scroll",
      c: "TOGGLE_THEME_TYPE",
      d: "TOGGLE_DIAGNOSTICS",
      f: "TOGGLE_FULLSCREEN",
      h: "TOGGLE_HIGHLIGHT",
      k: "TOGGLE_PLAYING",
      m: "TOGGLE_AUDIO",
      s: "TOGGLE_SETTINGS",
      0: "RESET_FONT_SIZE",
      _: "DECREASE_FONT_SIZE",
      "-": "DECREASE_FONT_SIZE",
      "+": "INCREASE_FONT_SIZE",
      "=": "INCREASE_FONT_SIZE",
      " ": "TOGGLE_PLAYING",
    };
    const type = keyTypeMap[String(event.key).toLowerCase()];
    if (type === "scroll") {
      if (
        this.scrollState !== STATE_POLLING &&
        this.scrollState !== STATE_REFLOW
      ) {
        this._setStateRelease();
      }
    } else if (type) {
      this.dispatch({ type });
      event.preventDefault();
    } else {
      this._showControls();
    }
  }

  _onMouseMove() {
    this._showControls();
  }

  _onTouchCancel() {
    const { scrollState } = this;
    if (
      scrollState === STATE_TOUCH ||
      scrollState === STATE_MOVE ||
      scrollState === STATE_RELEASE
    ) {
      this._setStateRelease();
    }
    this._showControls(false);
  }

  _onTouchEnd() {
    const { scrollState, scrollTimeout } = this;
    if (scrollState === STATE_TOUCH && scrollTimeout < TIMEOUT_TOUCH) {
      this._setStateScrolling();
      this._showControls();
    } else {
      if (scrollState === STATE_MOVE || scrollState === STATE_RELEASE) {
        this._setStateRelease();
      }
      this._showControls(false);
    }
  }

  _onTouchMove() {
    const { scrollState } = this;
    if (
      scrollState === STATE_SCROLLING ||
      scrollState === STATE_TOUCH ||
      scrollState === STATE_CATCHUP
    ) {
      this._setStateMove();
    }
    this._showControls(false);
  }

  _onTouchStart() {
    const { scrollState } = this;
    if (
      scrollState === STATE_SCROLLING ||
      scrollState === STATE_TOUCH ||
      scrollState === STATE_CATCHUP
    ) {
      this._setStateTouch();
    } else if (scrollState === STATE_MOVE || scrollState === STATE_RELEASE) {
      this._setStateMove();
    }
    this._showControls(false);
  }

  _onScroll() {
    const { scrollState, scrollTimeout } = this;
    if (
      (scrollState === STATE_TOUCH && scrollTimeout < TIMEOUT_TOUCH) ||
      scrollState === STATE_MOVE
    ) {
      this._setStateMove();
    } else if (scrollState === STATE_RELEASE) {
      this._setStateReleaseScroll();
    }
    if (scrollState !== STATE_SCROLLING && scrollState !== STATE_CATCHUP) {
      this._showControls(false);
    }
  }

  _onWheel() {
    const { scrollState } = this;
    if (scrollState !== STATE_POLLING && scrollState !== STATE_REFLOW) {
      this._setStateRelease();
    }
  }

  _resetActive() {
    if (this.activeEl) {
      this.activeEl.classList.remove("chant-active");
      this.activeEl = null;
    }
    this.activeIndex = null;
    this.activeChantIndex = null;
  }

  _scrollToInitialChant() {
    const chantIndex = this.initialChantIndex;
    if (_isFinite(chantIndex)) {
      const chant = this.dim?.chants?.[chantIndex];
      if (chant) {
        this._scrollToPosition(chantIndex === 0 ? 0 : chant.top);
      }
    }
  }

  _scrollToPosition(position) {
    const top = Math.max(0, position - this._getMidPosition());
    this.scrollerEl.scrollTo({ left: 0, top });
    this.dim.scrollTop = top;
  }

  _setStateMove() {
    this.scrollState = STATE_MOVE;
    this.scrollTimeout = TIMEOUT_MOVE;
  }

  _setStateRelease() {
    this.scrollState = STATE_RELEASE;
    this.scrollTimeout = TIMEOUT_RELEASE;
  }

  _setStateReleaseScroll() {
    this.scrollState = STATE_RELEASE;
    this.scrollTimeout = this._isSlowScroll()
      ? TIMEOUT_RELEASE_SLOW
      : TIMEOUT_RELEASE_SCROLL;
  }

  _setStateScrolling() {
    this.scrollState = STATE_SCROLLING;
    this.scrollTimeout = 0;
  }

  _setStateTouch() {
    this.scrollState = STATE_TOUCH;
    this.scrollTimeout = TIMEOUT_TOUCH;
  }

  _setTimeFromCurrentPosition() {
    const scrollTop = this.dim.scrollTop;
    const position = scrollTop == 0 ? 0 : scrollTop + this._getMidPosition();
    const [time, mediaTime] = this._getTimeFromPosition(position);
    this.time = time;
    this.lastTimestamp = this.loop.timestamp;
    if (this.useMediaPlayer) this.mediaPlayer.setTime(mediaTime);
  }

  _showControls(force = true) {
    if (force || this.controlsTimeout > 0)
      this.controlsTimeout = TIMEOUT_CONTROLS_IDLE;
  }
}

export default ChantScrollerModel;

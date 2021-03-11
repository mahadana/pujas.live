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

const ACCELERATION_TIMEOUT = 2 * 60; // 2 seconds
const DEFAULT_FONT_SIZE = 20; // 20px
const HUMAN_SCROLL_TIMEOUT = 10; // 1/6 second
const PREPARING_TIMEOUT = 30; // 1/2 second
const NEAR_TIME = 1; // 1 second
const FAR_TIME = 20; // 20 seconds
const MID_VIEW_RATIO = 0.5; // middle of window

let _chantSetId = 0;

class ChantScrollerModel {
  constructor() {
    this.debugEl = null;
    this.domEl = null;
    this.dispatch = () => undefined;
    this.mediaPlayer = getMediaPlayerSingleton();
    this.state = { fontSize: DEFAULT_FONT_SIZE };
    this.reset();
    this.loop = makeLoop(this._loop.bind(this));
    this._onHumanActivity = this._onHumanActivity.bind(this);
    this._onHumanScroll = this._onHumanScroll.bind(this);
  }

  attach(domEl) {
    this.detach();
    this.domEl = domEl;
    this.domEl.addEventListener("keydown", this._onHumanActivity);
    this.domEl.addEventListener("touchmove", this._onHumanActivity);
    this.domEl.addEventListener("wheel", this._onHumanActivity);
    this.domEl.addEventListener("scroll", this._onHumanScroll);
    this.domEl.style.setProperty("font-size", this.state.fontSize + "px");
    this.debugEl = this._createDebugElement();
    document.body.appendChild(this.debugEl);
    this.mediaPlayer.attach();
    this.loop.start();
  }

  detach() {
    if (this.domEl) {
      this.domEl.removeEventListener("keydown", this._onHumanActivity);
      this.domEl.removeEventListener("touchmove", this._onHumanActivity);
      this.domEl.removeEventListener("wheel", this._onHumanActivity);
      this.domEl.removeEventListener("scroll", this._onHumanScroll);
      this.domEl.style.removeProperty("font-size");
    }
    this.domEl = null;
    if (this.debugEl) document.body.removeChild(this.debugEl);
    this.debugEl = null;
    this.mediaPlayer.detach();
    this.loop.stop();
  }

  reset() {
    this.chantSet = null;
    this.delta = 0;
    this.dim = null;
    this.humanTimeout = 0;
    this.initialChantIndex = null;
    this.lastTimestamp = null;
    this.mediaStamp = null;
    this.setupCounter = 0;
    this.setupState = "INIT";
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

  _createDebugElement() {
    const debugEl = document.createElement("div");
    debugEl.style.cssText = `
      bottom: 0;
      background-color: black;
      color: white;
      display: none;
      font-family: monospace;
      font-size: min(2.3vw, 14px);
      left: 0;
      overflow: hidden;
      padding: 4px;
      position: fixed;
      white-space: nowrap;
      z-index: 99999;
    `;
    return debugEl;
  }

  _getDimensions() {
    const dim = {
      scrollTop: this.domEl.scrollTop,
      scrollHeight: this.domEl.scrollHeight,
      clientHeight: this.domEl.clientHeight,
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

  _loop() {
    if (this.setupState === "READY") {
      this._loopUpdateWindow();
      this._loopUpdateTime();
      this._loopHandleHuman();
      this._loopUpdateActive();
      this._loopUpdateVelocity();
      this._loopScroll();
      this._loopUpdateUseMedia();
      this._loopUpdatePlayMedia();
    } else {
      this._loopSetup();
    }
    this._loopUpdateDebug();
  }

  _loopHandleHuman() {
    if (this.humanTimeout > 0) {
      this.humanTimeout -= 1;
      if (this.humanTimeout == HUMAN_SCROLL_TIMEOUT - 1) {
        // this.dim.scrollTop = this.domEl.scrollTop;
      } else if (this.humanTimeout <= 0) {
        this.humanTimeout = 0;
        this.velocity = 0;
        this.dim.scrollTop = this.domEl.scrollTop;
        this._setTimeFromCurrentPosition();
      }
    }
  }

  _loopScroll() {
    if (!this.state.playing || this.humanTimeout > 0) return;
    const top = this.dim.scrollTop + this.velocity / 60;
    this.domEl.scrollTo({ left: 0, top });
    this.dim.scrollTop = top;
  }

  _loopSetup() {
    switch (this.setupState) {
      case "INIT": {
        if (this.domEl) {
          this.domEl.style.setProperty("opacity", "0");
          this.domEl.style.setProperty("transition", "opacity 1s");
        }
        const domId = this.chantSet?.domId;
        if (domId) {
          const el = document.getElementById(this.chantSet.domId);
          if (el) {
            this.setupCounter = 0;
            this.setupState = "PREPARING";
          }
        }
        break;
      }
      case "PREPARING": {
        if (this.setupCounter % PREPARING_TIMEOUT == 0) {
          // We do this twice because for some reason, the initial reflow
          // doesn't always accurately assign the offsets.
          this._initializeDimensions();
          this._scrollToInitialChant();
          this._setTimeFromCurrentPosition();
          this._loopUpdateActive();
          this._loopUpdateUseMedia();
          this.domEl.focus();
        }
        if (this.setupCounter == 1) {
          this.domEl.style.setProperty("opacity", "1");
        }
        if (this.setupCounter >= PREPARING_TIMEOUT) {
          this.domEl.style.removeProperty("opacity");
          this.domEl.style.removeProperty("transition");
          this.setupCounter = 0;
          this.setupState = "READY";
        } else {
          this.setupCounter += 1;
        }
        break;
      }
    }
  }

  _loopUpdateActive() {
    if (this.humanTimeout > 0) {
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

  _loopUpdateDebug() {
    const code =
      (this.humanTimeout > 0 ? "H" : this.setupState[0]) +
      (this.useMediaPlayer ? "M" : "T") +
      this.mediaPlayer.getStateCode();
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
    const file = (this._getMediaUrl() ?? "").split("/").splice(-1)[0];
    this.debugEl.innerText =
      `${code} ${ci}/${ni} t=${t} y=${y} v=${v} ` +
      `s=${se}/${sd} m=${me}/${md} ${file}`;
    this.debugEl.style.display = this.state.diagnostics ? "block" : "none";
  }

  _loopUpdatePlayMedia() {
    if (this.useMediaPlayer && this.humanTimeout <= 0) {
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

  _loopUpdateUseMedia() {
    if (this.humanTimeout > 0) return;

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
    } else if (this.humanTimeout <= 0 && this.state.playing) {
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

    this.velocity =
      (this.velocity * (ACCELERATION_TIMEOUT - 1) + targetVelocity) /
      ACCELERATION_TIMEOUT;
  }

  _loopUpdateWindow() {
    const windowStamp = [window.innerWidth, window.innerHeight];
    let reload =
      Boolean(this.windowStamp) && !_isEqual(windowStamp, this.windowStamp);
    this.windowStamp = windowStamp;

    const fontSizeValue = this.state.fontSize + "px";
    if (this.domEl.style.getPropertyValue("font-size") !== fontSizeValue) {
      this.domEl.style.setProperty("font-size", fontSizeValue);
      reload = true;
    }

    if (reload) {
      this._initializeDimensions();
      const [position] = this._getPositionFromTime(this.time);
      this._scrollToPosition(position);
      this.velocity = 0;
    }
  }

  _onHumanActivity() {
    this.humanTimeout = HUMAN_SCROLL_TIMEOUT;
  }

  _onHumanScroll() {
    if (this.humanTimeout > 0) {
      this.humanTimeout = HUMAN_SCROLL_TIMEOUT;
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
    this.domEl.scrollTo({ left: 0, top });
    this.dim.scrollTop = top;
  }

  _setTimeFromCurrentPosition() {
    const scrollTop = this.dim.scrollTop;
    const position = scrollTop == 0 ? 0 : scrollTop + this._getMidPosition();
    const [time, mediaTime] = this._getTimeFromPosition(position);
    this.time = time;
    this.lastTimestamp = this.loop.timestamp;
    if (this.useMediaPlayer) this.mediaPlayer.setTime(mediaTime);
  }
}

export default ChantScrollerModel;

import _castArray from "lodash/castArray";
import _isEqual from "lodash/isEqual";
import _isFinite from "lodash/isFinite";
import _isObject from "lodash/isObject";
import _merge from "lodash/merge";
import _pick from "lodash/pick";
import _throttle from "lodash/throttle";

import { getMediaPlayerSingleton } from "@/components/chanting/ChantMediaPlayer";
import {
  bindInteger,
  createChantMappings,
  getIndexInterPosition,
  getIndexInterTime,
  getIndexPositionFromTime,
  getIndexTimeFromPosition,
  getTimingStore,
  interpolateTiming,
  normalizeDimension,
  normalizeTiming,
  orderDimension,
  staggerRowsInDimension,
  scale,
} from "@/lib/chanting";

const DEFAULT_FONT_SIZE = 20; // px
const HUMAN_SCROLL_TIMEOUT = 10; // 1/6 second
const PREPARING_TIMEOUT = 10; // 1/6 second
const NEAR_TIME = 1; // seconds
const FAR_TIME = 5; // seconds
const MID_VIEW_RATIO = 0.5; // middle of window

const throttleError = _throttle(console.error, 5000);
// const throttleLog = _throttle(console.log, 1000);

let _chantSetId = 0;

class ChantScrollerModel {
  constructor() {
    this.animationRequest = null;
    this.debugEl = null;
    this.domEl = null;
    this.dispatch = () => undefined;
    this.mediaPlayer = getMediaPlayerSingleton();
    this.state = { fontSize: DEFAULT_FONT_SIZE };
    this._reset();
    this._loop = this._loop.bind(this);
    this._onHumanScroll = this._onHumanScroll.bind(this);
  }

  attach(domEl) {
    this.detach();
    this.domEl = domEl;
    this.domEl.addEventListener("keydown", this._onHumanScroll);
    this.domEl.addEventListener("touchmove", this._onHumanScroll);
    this.domEl.addEventListener("touchstart", this._onHumanScroll);
    this.domEl.addEventListener("wheel", this._onHumanScroll);
    this.domEl.style.setProperty("font-size", this.state.fontSize + "px");
    this.debugEl = this._createDebugElement();
    document.body.appendChild(this.debugEl);
    this.mediaPlayer.attach();
    this.animationRequest = window.requestAnimationFrame(this._loop);
  }

  detach() {
    if (this.domEl) {
      this.domEl.removeEventListener("wheel", this._onHumanScroll);
      this.domEl.removeEventListener("touchstart", this._onHumanScroll);
      this.domEl.removeEventListener("touchmove", this._onHumanScroll);
      this.domEl.removeEventListener("keydown", this._onHumanScroll);
      this.domEl.style.removeProperty("font-size");
    }
    this.domEl = null;
    if (this.debugEl) document.body.removeChild(this.debugEl);
    this.debugEl = null;
    this.mediaPlayer.detach();
    if (this.animationRequest)
      window.cancelAnimationFrame(this.animationRequest);
    this.animationRequest = null;
  }

  setDispatch(dispatch) {
    this.dispatch = dispatch;
  }

  setState(state) {
    const reload =
      this.state.chantData !== state.chantData ||
      this.state.chantSet !== state.chantSet;
    this.state = state;
    if (reload) {
      this._reset();
      this._initializeChantSet();
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
      font-size: 14px;
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
    if (!this.state.chantData || !this.state.chantSet) {
      this.chantSet = null;
      return;
    }
    const { chantIds, link, title } = this.state.chantSet;
    const timingStore = getTimingStore();
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
        let timing = normalizeTiming(timingStore?.[chant.id], nodes.length);
        if (_isFinite(timing.end)) {
          timing = interpolateTiming(timing);
        } else {
          console.log(`${chant.id} has insufficient timing, using estimate`);
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

  async _loop(timestamp) {
    this.elapsed = timestamp - this.timestamp ?? timestamp;
    this.timestamp = timestamp;

    const start = performance.now();
    try {
      if (this.setupState === "READY") {
        this._loopUpdateWindow();
        this._loopUpdateTime();
        this._loopHandleHuman();
        this._loopUpdateActive();
        this._loopUpdateVelocity();
        this._loopScroll();
        this._loopUpdateMedia();
      } else {
        this._loopSetup();
      }
    } catch (error) {
      throttleError(error);
    }
    this.duration = performance.now() - start;

    this._loopUpdateDebug();
    this.animationRequest = window.requestAnimationFrame(this._loop);
  }

  _loopHandleHuman() {
    if (this.humanTimeout > 0) {
      this.humanTimeout -= 1;
      if (this.humanTimeout <= 0) {
        this.humanTimeout = 0;
        this.dim.scrollTop = this.domEl.scrollTop;
        this._setTimeFromCurrentPosition();
      }
    }
  }

  _loopSetup() {
    switch (this.setupState) {
      case "INIT": {
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
        }
        if (this.setupCounter >= PREPARING_TIMEOUT) {
          this.setupCounter = 0;
          this.setupState = "READY";
        } else {
          this.setupCounter += 1;
        }
        break;
      }
    }
  }

  _loopScroll() {
    if (!this.state.playing || this.humanTimeout > 0) return;
    const delta = this.delta + this.velocity / 60;
    const jump = parseInt(delta);
    const top = this.dim.scrollTop + jump;
    this.delta = delta - jump;
    if (Math.abs(jump) > 0) {
      this.domEl.scrollTo({ left: 0, top });
      this.dim.scrollTop = top;
    }
  }

  _loopUpdateActive() {
    if (this.humanTimeout > 0) return;

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
    const calcDebug = (set, value) => {
      set.push(value);
      if (set.length > 20) set.shift();
      return Math.max(...set)
        .toFixed(2)
        .padStart(7, "0");
    };
    this.debugEl.innerText = [
      this.setupState[0],
      this.useMediaPlayer ? "M" : "T",
      this.mediaPlayer.getStateCode(),
      this.humanTimeout > 0 ? "H" : "-",
      `${this.activeChantIndex ?? "--"}`.padStart(2, "0"),
      `${this.activeIndex ?? "--"}`.padStart(2, "0"),
      String(this.dim?.scrollTop ?? 0).padStart(5, "0"),
      this.time.toFixed(1).padStart(6, "0"),
      this.velocity.toFixed(1).padStart(4, "0"),
      calcDebug(this.debugDurationSet, this.duration),
      calcDebug(this.debugElapsedSet, this.elapsed - 1000 / 60),
      (this._getMediaUrl() ?? "").split("/").splice(-1)[0],
    ].join(" ");
    this.debugEl.style.display = this.state.diagnostics ? "block" : "none";
  }

  _loopUpdateMedia() {
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

    if (this.useMediaPlayer) {
      const mpState = this.mediaPlayer.state;
      if (this.state.playing && this.humanTimeout <= 0) {
        if (mpState === "ENDED") {
          this.dispatch({ type: "STOP_PLAYING" });
          this.state.playing = false; // do not wait for React
        } else {
          this.mediaPlayer.play();
        }
      } else if (!this.state.playing || this.humanTimeout > 0) {
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

  _loopUpdateTime() {
    const mediaPlayerTime = this._getMediaPlayerTime();
    if (_isFinite(mediaPlayerTime)) {
      this.time = mediaPlayerTime;
    } else if (this.humanTimeout <= 0 && this.state.playing) {
      this.time += (this.elapsed * (this.state.speed ?? 1)) / 1000;
    }

    if (this.time >= this.dim.end) {
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

    const nearVelocity = (nearPosition - mid - scrollTop) / NEAR_TIME;
    const farVelocity = (farPosition - mid - scrollTop) / FAR_TIME;
    this.velocity = farVelocity * (1 - ratio) + nearVelocity * ratio;
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
    }
  }

  _onHumanScroll() {
    this.humanTimeout = HUMAN_SCROLL_TIMEOUT;
  }

  _reset() {
    this._resetActive();
    this.mediaPlayer.stop();
    this.chantSet = null;
    this.debugDurationSet = [];
    this.debugElapsedSet = [];
    this.delta = 0;
    this.dim = null;
    this.duration = 0;
    this.elapsed = 0;
    this.humanTimeout = 0;
    this.initialChantIndex = null;
    this.mediaStamp = null;
    this.setupCounter = 0;
    this.setupState = "INIT";
    this.time = 0;
    this.timestamp = null;
    this.useMediaPlayer = false;
    this.velocity = 0;
    this.windowStamp = null;
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
        this._scrollToPosition(chant.top);
      }
    }
  }

  _scrollToPosition(position) {
    const top = Math.max(0, position - this._getMidPosition());
    this.domEl.scrollTo({ left: 0, top });
    this.dim.scrollTop = top;
  }

  _setTimeFromCurrentPosition() {
    const position = this.dim.scrollTop + this._getMidPosition();
    const [time, mediaTime] = this._getTimeFromPosition(position);
    this.time = time;
    if (this.useMediaPlayer) this.mediaPlayer.setTime(mediaTime);
  }
}

export default ChantScrollerModel;

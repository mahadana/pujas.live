import { makeStyles } from "@material-ui/core/styles";
import clamp from "lodash/clamp";
import isNil from "lodash/isNil";
import _isFinite from "lodash/isFinite";
import sum from "lodash/sum";
import throttle from "lodash/throttle";
import { useEffect, useRef } from "react";

import { useChantIdle } from "@/components/chanting/ChantIdleProvider";
import ChantMediaPlayer from "@/components/chanting/ChantMediaPlayer";

const BREAK_FACTOR = 15;
const HUMAN_SCROLL_TIMEOUT = 10; // 1/6 second
const MIN_ACCELERATION = -0.1;
const MAX_ACCELERATION = 0.1;
const OUTSIDE_HEIGHT = 200;
const MIN_VELOCITY = -6; // 6*60 = -360 px/s
const MAX_VELOCITY = 6; // 6*60 = 360 px/s
const MID_VIEW_RATIO = 0.45; // Middl'ish
const END_DISTANCE_THRESHOLD = 100; // px

const DEFAULT_SCROLL_DATA = {
  active: null,
  activeComplete: null,
  activeIndex: null,
  animationRequest: null,
  chant: null,
  delta: 0,
  dispatch: null,
  fontSize: null,
  ignoreNextScroll: false,
  skipTop: null,
  mediaPlayer: null,
  mediaUrl: null,
  next: null,
  nodes: null,
  humanScrollTimeout: 0,
  scroll: null,
  state: null,
  velocity: 0,
  windowHeight: null,
  windowWidth: null,
};

const useStyles = makeStyles((theme) => ({
  root: ({ idle, state }) => ({
    position: "absolute",
    cursor: idle && state.fullscreen ? "none" : "inherit",
    top: 0,
    right: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    overflowY: "scroll",
    scrollbarWidth: "none",
    "-ms-overflow-style": "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "&:focus": {
      outline: "none",
    },
    [theme.breakpoints.up("sm")]: {
      padding: "1rem",
    },
  }),
}));

const scrollError = throttle(console.error, 5000);
// const scrollLog = throttle(console.log, 500);

// let timeMax, timeMin, timeSum, timeCount;

// const resetPerformanceTest = () => {
//   timeMax = 0;
//   timeMin = 100000;
//   timeSum = 0;
//   timeCount = 0;
// };

// resetPerformanceTest();

// const reportAndResetPerformance = throttle(() => {
//   scrollLog({ timeAvg: timeSum / timeCount, timeMax, timeMin });
//   resetPerformanceTest();
// }, 1000);

// const performanceTest = (callback) => {
//   const start = performance.now();
//   callback();
//   const time = performance.now() - start;
//   timeSum += time;
//   timeCount += 1;
//   timeMax = Math.max(time, timeMax);
//   timeMin = Math.min(time, timeMin);
//   reportAndResetPerformance();
// };

const reportPerformance = (callback, id = "?") => {
  const start = performance.now();
  callback();
  const time = performance.now() - start;
  console.log(`ChantScroller.${id} ${time.toFixed(2)}ms`);
};

const getNodeInMidView = (data) => {
  const { nodes, scroll } = data;
  if (!nodes) return [null, null];
  let left = 0;
  let right = nodes.length;
  let middle = parseInt((left + right) / 2);
  const target = scroll.el.scrollTop + parseInt(scroll.el.clientHeight / 2);
  while (left < middle && middle < right) {
    const test = nodes[middle];
    if (!test) return [null, null];
    const testTop = test.offsetTop;
    const testBottom = testTop + test.offsetHeight;
    if (testBottom <= target) {
      left = middle;
      middle = parseInt((left + right) / 2);
    } else if (target < testTop) {
      right = middle;
      middle = parseInt((left + right + 1) / 2);
    } else {
      break;
    }
  }

  let a = middle;
  let b = middle;
  while (a > 0 && target < nodes[a - 1].offsetTop + nodes[a - 1].offsetHeight) {
    a -= 1;
  }
  while (b < nodes.length - 1 && target >= nodes[b + 1].offsetTop) {
    b += 1;
  }
  const start = nodes[a].offsetTop;
  const end = nodes[b].offsetTop + nodes[b].offsetHeight;
  let complete = 1 - clamp((end - target) / (end - start), 0, 1);
  const factor = complete * (1 + b - a);
  const index = a + parseInt(factor);
  complete = factor - parseInt(factor);
  return [index, complete];
};

const scrollReset = (data) => {
  const { active, activeComplete, activeIndex } = data;
  if (active) active.el.classList.remove("chant-active");
  data.active = null;
  data.activeComplete = null;
  data.activeIndex = null;
  data.next = null;
  updateActive(data);
  if (
    !isNil(data.activeIndex) &&
    !isNil(activeComplete) &&
    data.activeIndex === activeIndex
  ) {
    data.activeComplete = activeComplete;
  }
  data.scroll.scrollTop = null;
  data.scroll.scrollHeight = null;
  data.scroll.clientHeight = null;
};

const handleHumanScroll = (data) => {
  const { nodes, scroll, state } = data;
  data.humanScrollTimeout -= 1;
  if (data.humanScrollTimeout <= 0) {
    const [activeIndex, activeComplete] = getNodeInMidView(data);

    if (_isFinite(activeIndex)) {
      const active = nodes[activeIndex];
      if (active) {
        if (activeIndex === data.activeIndex) {
          data.activeComplete = activeComplete;
        } else {
          if (data.active) data.active.el.classList.remove("chant-active");
          active.el.classList.add("chant-active");
          data.active = active;
          data.activeIndex = activeIndex;
          data.activeComplete = activeComplete;
          data.next = null;
          state.activeIndex = activeIndex;
        }
      } else {
        data.active = null;
        data.activeIndex = null;
        data.activeComplete = null;
        data.next = null;
        state.activeIndex = null;
      }
    }

    scroll.scrollTop = null;
    scroll.scrollHeight = null;
    scroll.clientHeight = null;
    data.velocity = 0;
    data.delta = 0;
    data.humanScrollTimeout = 0;
  }
};

const buildNodeCache = (data) => {
  const { chant } = data.state;
  if (!chant) return;
  reportPerformance(() => {
    const map = chant.textNodeMap || [];
    const nodes = [];
    for (let i = 0; map[i]; i++) {
      const el = document.getElementById(`chant-text-index-${i}`);
      if (el) {
        nodes.push({
          duration: map[i].duration,
          el,
          offsetHeight: el.offsetHeight,
          offsetTop: el.offsetTop,
        });
        if (nodes.length > 1) {
          const a = nodes[nodes.length - 2];
          const b = nodes[nodes.length - 1];
          const aBottom = a.offsetTop + a.offsetHeight;
          if (aBottom == b.offsetTop + 1) {
            a.offsetHeight -= 1;
          }
        }
      }
    }
    if (nodes.length == 0 || nodes.length != map.length) {
      console.warn("Build node cache mismatch", nodes.length, map.length);
    } else {
      data.nodes = nodes;
    }
  }, "buildNodeCache");
};

const updateWindow = (data) => {
  const { fontSize, windowHeight, windowWidth, state } = data;
  const currentFontSize = state.fontSize;
  const currentWindowHeight = window.innerHeight;
  const currentWindowWidth = window.innerWidth;
  if (
    fontSize !== currentFontSize ||
    windowHeight !== currentWindowHeight ||
    windowWidth !== currentWindowWidth
  ) {
    data.chant = null;
    data.nodes = null;
    data.fontSize = currentFontSize;
    data.windowHeight = currentWindowHeight;
    data.windowWidth = currentWindowWidth;
  }
};

const updateChant = (data) => {
  const { chant, state } = data;
  if (!chant && state.chant) {
    data.chant = data.state.chant;
    data.nodes = null;
    buildNodeCache(data);
  } else if (chant && !state.chant) {
    data.chant = null;
    data.nodes = null;
  }
};

const updateScroll = (data) => {
  const { scroll } = data;
  if (!_isFinite(scroll.scrollTop)) {
    // Only call scrollTop when needed because it forces a reflow. For a large
    // element, this will cause hiccups during scrolling.
    scroll.scrollTop = scroll.el.scrollTop;
    scroll.scrollHeight = scroll.el.scrollHeight;
    scroll.clientHeight = scroll.el.clientHeight;
  }
};

const updateActive = (data) => {
  const { nodes, state } = data;
  let { active, activeIndex } = data;
  if (!nodes || activeIndex === state.activeIndex) return;
  activeIndex = state.activeIndex;
  if (active) active.el.classList.remove("chant-active");
  active = nodes[activeIndex];
  if (active) active.el.classList.add("chant-active");
  data.active = active;
  data.activeIndex = activeIndex;
  data.activeComplete = 0;
  data.next = null;
};

const updateNext = (data) => {
  const { active, activeIndex, nodes, scroll } = data;
  if (!nodes || !_isFinite(activeIndex)) return;
  const max = nodes.length - 1;
  const next = [];
  // Get at least scroll.clientHeight worth of nodes
  for (let i = 0, height = 0; i < max && height < scroll.clientHeight; i++) {
    const node = nodes[activeIndex + 1 + i];
    if (node) {
      height = node.offsetTop - active.offsetTop + node.offsetHeight;
      next.push(node);
    } else {
      break;
    }
  }
  data.next = next;
};

const updateVelocity = (data) => {
  const { active, activeComplete, next, scroll, state } = data;

  if (!active || !state.playing) {
    data.velocity = data.velocity * 0.99;
    return;
  }

  let targetDuration, targetHeight;
  if (next && next.length > 0) {
    targetDuration = active.duration + sum(next.map((node) => node.duration));
    const lastNext = next[next.length - 1];
    targetHeight =
      lastNext.offsetTop - active.offsetTop + lastNext.offsetHeight;
  } else {
    targetDuration = active.duration;
    targetHeight = active.offsetHeight;
  }

  const speed = state.speed || 1;
  let idealVelocity = (speed * targetHeight) / (targetDuration * 60);

  const endDistance =
    scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight;
  if (endDistance < END_DISTANCE_THRESHOLD) {
    idealVelocity =
      idealVelocity *
      Math.atan((Math.PI / 2) * (endDistance / END_DISTANCE_THRESHOLD)) ** 2;
  }

  const midHeight = parseInt(scroll.clientHeight * MID_VIEW_RATIO);
  const activeCompleteHeight = parseInt(
    active.offsetHeight * (activeComplete ?? 1)
  );
  const idealTop = active.offsetTop + activeCompleteHeight - midHeight;
  const diffTop = idealTop - scroll.scrollTop;
  const minDiffTop = -(midHeight + OUTSIDE_HEIGHT);
  const maxDiffTop = scroll.clientHeight - (midHeight - OUTSIDE_HEIGHT);

  if (diffTop < minDiffTop || maxDiffTop < diffTop) {
    data.delta = 0;
    data.velocity = 0;
    data.skipTop = idealTop;
    return;
  }

  const catchUpVelocity = clamp(
    diffTop / 60, // 1 second
    MIN_VELOCITY,
    MAX_VELOCITY
  );

  const diffRatio = (Math.abs(diffTop) * 2) / scroll.clientHeight;
  const clampedRatio = Math.min(diffRatio, 1) ** 2;
  const weightedVelocity =
    idealVelocity * (1 - clampedRatio) + catchUpVelocity * clampedRatio;

  let acceleration = clamp(
    (weightedVelocity - data.velocity) / (1 * 60), // 1 seconds
    MIN_ACCELERATION,
    MAX_ACCELERATION
  );
  if (Math.sign(diffTop) * acceleration < 0) acceleration *= BREAK_FACTOR;
  data.velocity += acceleration;
};

const executeScroll = (data) => {
  const { skipTop, scroll, velocity } = data;
  if (_isFinite(skipTop)) {
    const top = skipTop;
    data.skipTop = null;
    data.ignoreNextScroll = true;
    scroll.el.scrollTo({ top, left: 0 });
    scroll.scrollTop = top;
  } else {
    const delta = data.delta + velocity;
    const jump = parseInt(delta);
    const top = scroll.scrollTop + jump;
    data.delta = delta - jump;
    if (Math.abs(jump) > 0) {
      data.ignoreNextScroll = true;
      scroll.el.scrollTo({ top, left: 0 });
      scroll.scrollTop = top;
    }
  }
};

const incrementActive = (data) => {
  const { active, activeComplete, activeIndex, dispatch, nodes, state } = data;
  if (!state.playing) return;

  // Instead of using dispatch, we can explicitly set state.activeIndex. This
  // will prevent React from firing and occasionally causing scrolling stutters.
  //
  // This will not fire any dependencies on updating the state, but this is okay
  // for our purposes.
  //
  // In the next loop, data.activeIndex will get updated based on
  // state.activeIndex.

  if (activeIndex === "START") {
    if (!isNil(activeComplete)) {
      state.activeIndex = 0;
      data.activeComplete = null;
    }
  } else if (activeIndex === "END") {
    if (!isNil(activeComplete)) {
      dispatch({ type: "SET_ACTIVE_INDEX", activeIndex: "END" });
      dispatch({ type: "STOP_PLAYING" });
      data.activeComplete = null;
    }
  } else if (_isFinite(activeIndex) && _isFinite(activeComplete) && active) {
    if (activeComplete >= 1) {
      if (activeIndex >= nodes.length - 1) {
        dispatch({ type: "SET_ACTIVE_INDEX", activeIndex: "END" });
        dispatch({ type: "STOP_PLAYING" });
      } else {
        state.activeIndex += 1;
      }
      data.activeComplete = null;
    } else {
      const speed = state.speed || 1;
      data.activeComplete += speed / (60 * active.duration);
    }
  }
};

const updateMediaPlayer = (data) => {
  const { mediaPlayer, state } = data;
  let { mediaUrl } = data;
  if (mediaUrl !== state.mediaUrl) {
    console.log("updateMediaUrl", mediaUrl, state.mediaUrl);
    data.mediaUrl = mediaUrl = state.mediaUrl;
    if (mediaUrl) {
      mediaPlayer.setUrl(mediaUrl);
      data.active = null;
      data.activeIndex = "START";
      data.activeComplete = 0;
      state.activeIndex = "START";
    } else {
      mediaPlayer.remove();
    }
  }

  const mediaPlaying = mediaPlayer.isPlaying();
  if (state.playing && !mediaPlaying) {
    mediaPlayer.play();
  } else if (!state.playing && mediaPlaying) {
    mediaPlayer.pause();
  }
};

const updatePerformanceIndicator = (data, name, value) => {
  const el = document.getElementById(`chant-performance-${name}`);
  if (!el) return;
  value = Math.max(0, value);
  const current = parseInt(el.style.height) || 0;
  if (data.state.performance && value > current) {
    el.style.height = `${Math.min(value, 400)}px`;
  } else {
    el.style.height = `${Math.max(0, current - 3)}px`;
  }
};

const scrollLoop = (data) => {
  data.animationRequest = null;
  try {
    // performanceTest(() => {
    updateWindow(data);
    if (data.humanScrollTimeout > 0) {
      handleHumanScroll(data);
    } else {
      updateChant(data);
      updateScroll(data);
      updateActive(data);
      updateNext(data);
      updateVelocity(data);
      executeScroll(data);
      incrementActive(data);
      updateMediaPlayer(data);
    }
    // });
  } catch (error) {
    scrollError(error);
  }
  data.animationRequest = window.requestAnimationFrame((ts) => {
    if (!_isFinite(data.ts)) data.ts = ts;
    const miss = ts - data.ts;
    data.ts = ts;

    const start = performance.now();
    scrollLoop(data);
    const long = performance.now() - start;

    updatePerformanceIndicator(data, "miss", (miss - 1000 / 60) * 2);
    updatePerformanceIndicator(data, "long", (long - 1) * 10);
  });
};

const onScrollEvent = (data) => {
  if (data.ignoreNextScroll) {
    data.ignoreNextScroll = false;
  } else {
    data.humanScrollTimeout = HUMAN_SCROLL_TIMEOUT;
  }
};

const onKeyDownEvent = (data) => {
  data.humanScrollTimeout = HUMAN_SCROLL_TIMEOUT;
};

const ChantScroller = ({ children, dispatch, state }) => {
  const idle = useChantIdle();
  const mediaPlayerRef = useRef();
  const domRef = useRef();
  const scrollRef = useRef();
  const classes = useStyles({ idle, state });

  useEffect(() => {
    let data = scrollRef.current;
    const mediaPlayer = mediaPlayerRef.current;
    const scroll = { el: domRef.current };
    if (data) {
      data.mediaPlayer = mediaPlayer;
      data.scroll = scroll;
    } else {
      data = scrollRef.current = {
        ...DEFAULT_SCROLL_DATA,
        mediaPlayer,
        scroll,
        state: {},
      };
    }
    const localOnScrollEvent = () => onScrollEvent(data);
    const localOnKeyDownEvent = () => onKeyDownEvent(data);
    scroll.el.addEventListener("scroll", localOnScrollEvent);
    scroll.el.addEventListener("keydown", localOnKeyDownEvent);
    scrollLoop(data);
    return () => {
      if (data.animationRequest) {
        window.cancelAnimationFrame(data.animationRequest);
      }
      scroll.el.removeEventListener("scroll", localOnScrollEvent);
      scroll.el.removeEventListener("keydown", localOnKeyDownEvent);
    };
  }, []);

  useEffect(() => {
    const { current: data } = scrollRef;
    if (data) {
      data.dispatch = dispatch;
      data.state = state;
      scrollReset(data);
    } else {
      scrollRef.current = {
        ...DEFAULT_SCROLL_DATA,
        dispatch,
        mediaPlayer: mediaPlayerRef.current,
        state,
      };
    }
  }, [dispatch, state]);

  return (
    <div className={classes.root} ref={domRef} tabIndex="0">
      {children}
      <ChantMediaPlayer ref={mediaPlayerRef} />
    </div>
  );
};

export default ChantScroller;

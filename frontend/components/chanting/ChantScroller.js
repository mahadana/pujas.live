import { makeStyles } from "@material-ui/core/styles";
import clamp from "lodash/clamp";
import isNil from "lodash/isNil";
import _isFinite from "lodash/isFinite";
import sum from "lodash/sum";
import throttle from "lodash/throttle";
import { useEffect, useRef } from "react";

const BREAK_FACTOR = 15;
const HUMAN_SCROLL_TIMEOUT = 12; // 0.2 seconds
const MIN_ACCELERATION = -0.1;
const MAX_ACCELERATION = 0.1;
const OUTSIDE_HEIGHT = 200;
const MIN_VELOCITY = -6; // 6*60 = -360 px/s
const MAX_VELOCITY = 6; // 6*60 = 360 px/s
const MID_VIEW_RATIO = 0.5; // Middl'ish
const END_DISTANCE_THRESHOLD = 100; // px

const DEFAULT_SCROLL_DATA = {
  active: null,
  activeComplete: null,
  activeIndex: null,
  animationRequest: null,
  delta: 0,
  dispatch: null,
  ignoreNextScroll: false,
  skipTop: null,
  next: null,
  humanScrollTimeout: 0,
  scroll: null,
  state: null,
  velocity: 0,
};

const useStyles = makeStyles((theme) => ({
  root: ({ state }) => ({
    position: "absolute",
    cursor: state.idle && state.fullscreen ? "none" : "inherit",
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

const getTextIndexInView = (el, textCount) => {
  let left = 0;
  let right = textCount || 0;
  let middle = parseInt((left + right) / 2);
  const target = el.scrollTop + parseInt(el.clientHeight * MID_VIEW_RATIO);
  while (left < middle && middle < right) {
    const testEl = document.getElementById(`chant-text-index-${middle}`);
    if (!testEl) return null;
    const testTop = testEl.offsetTop;
    const testBottom = testTop + testEl.clientHeight;

    if (testBottom < target) {
      left = middle;
      middle = parseInt((left + right) / 2);
    } else if (target < testTop) {
      right = middle;
      middle = parseInt((left + right + 1) / 2);
    } else {
      break;
    }
  }
  return middle;
};

const getNodeData = (chant, index) => {
  const el = document.getElementById(`chant-text-index-${index}`);
  const duration = chant.textNodeMap?.[index]?.duration;
  if (el && _isFinite(duration)) {
    const clientHeight = el.clientHeight;
    const offsetTop = el.offsetTop;
    return { clientHeight, duration, el, offsetTop };
  } else {
    return null;
  }
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
};

const handleHumanScroll = (data) => {
  const { dispatch, scroll, state } = data;
  data.humanScrollTimeout -= 1;
  if (data.humanScrollTimeout <= 0) {
    const activeIndex = getTextIndexInView(scroll.el, state.chant.textCount);
    if (activeIndex) dispatch?.({ type: "SET_ACTIVE_INDEX", activeIndex });
    scroll.scrollTop = null;
    scroll.scrollHeight = null;
    data.velocity = 0;
    data.delta = 0;
    data.humanScrollTimeout = 0;
  }
};

const updateScroll = (data) => {
  const { scroll } = data;
  if (!_isFinite(scroll.scrollTop)) {
    // Only call scrollTop when needed because it forces a reflow. For a large
    // element, this will cause hiccups during scrolling.
    scroll.scrollTop = scroll.el.scrollTop;
    scroll.scrollHeight = scroll.el.scrollHeight;
  }
  scroll.clientHeight = scroll.el.clientHeight;
};

const updateActive = (data) => {
  const { state } = data;
  let { active, activeIndex } = data;
  if (activeIndex === state?.activeIndex || !state?.chant) return;
  activeIndex = state.activeIndex;
  if (active) active.el.classList.remove("chant-active");
  if (_isFinite(activeIndex) && state?.chant) {
    active = getNodeData(state.chant, activeIndex);
  } else {
    active = null;
  }
  if (active) active.el.classList.add("chant-active");
  data.active = active;
  data.activeIndex = activeIndex;
  data.activeComplete = 0;
  data.next = null;
};

const updateNext = (data) => {
  const { active, activeIndex, scroll, state } = data;
  if (data.next || !state?.chant || !active || !_isFinite(activeIndex)) return;
  const max = state.chant.textCount - 1;
  const next = [];
  // Get at least scroll.clientHeight worth of nodes
  for (let i = 0, height = 0; i < max && height < scroll.clientHeight; i++) {
    const node = getNodeData(state.chant, activeIndex + 1 + i);
    if (node) {
      height = node.offsetTop - active.offsetTop + node.clientHeight;
      next.push(node);
    } else {
      break;
    }
  }
  data.next = next;
};

const updateVelocity = (data) => {
  const { active, activeComplete, next, scroll, state } = data;

  if (!active || !state?.chant || !state?.playing) {
    data.velocity = data.velocity * 0.99;
    return;
  }

  let targetDuration, targetHeight;
  if (next && next.length > 0) {
    targetDuration = active.duration + sum(next.map((node) => node.duration));
    const lastNext = next[next.length - 1];
    targetHeight =
      lastNext.offsetTop - active.offsetTop + lastNext.clientHeight;
  } else {
    targetDuration = active.duration;
    targetHeight = active.clientHeight;
  }

  const speed = state?.speed || 1;
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
    active.clientHeight * (activeComplete ?? 1)
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
    (weightedVelocity - data.velocity) / (10 * 60), // 10 seconds
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
  const { active, activeComplete, activeIndex, dispatch, state } = data;
  if (!state?.playing) return;

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
      if (activeIndex >= state.chant.textCount - 1) {
        dispatch({ type: "SET_ACTIVE_INDEX", activeIndex: "END" });
        dispatch({ type: "STOP_PLAYING" });
      } else {
        state.activeIndex += 1;
      }
      data.activeComplete = null;
    } else {
      const speed = state?.speed || 1;
      data.activeComplete += speed / (60 * active.duration);
    }
  }
};

const scrollLoop = (data) => {
  data.animationRequest = null;
  try {
    // performanceTest(() => {
    if (data.humanScrollTimeout > 0) {
      handleHumanScroll(data);
    } else {
      updateScroll(data);
      updateActive(data);
      updateNext(data);
      updateVelocity(data);
      executeScroll(data);
      incrementActive(data);
    }
    // });
  } catch (error) {
    scrollError(error);
  }
  data.animationRequest = window.requestAnimationFrame(() => scrollLoop(data));
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
  const domRef = useRef();
  const scrollRef = useRef();
  const classes = useStyles({ state });

  useEffect(() => {
    let data = scrollRef.current;
    const scroll = { el: domRef.current };
    if (data) {
      data.scroll = scroll;
    } else {
      data = scrollRef.current = { ...DEFAULT_SCROLL_DATA, scroll };
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
      scrollRef.current = { ...DEFAULT_SCROLL_DATA, dispatch, state };
    }
  }, [dispatch, state]);

  return (
    <div className={classes.root} ref={domRef} tabIndex="0">
      {children}
    </div>
  );
};

export default ChantScroller;

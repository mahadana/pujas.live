import { makeStyles } from "@material-ui/core/styles";
import clamp from "lodash/clamp";
import _isFinite from "lodash/isFinite";
import sum from "lodash/sum";
import throttle from "lodash/throttle";
import { useEffect, useRef } from "react";

const BREAK_FACTOR = 15;
const HUMAN_SCROLL_TIMEOUT = 6; // 0.1 seconds
const HUMAN_SCROLL_THRESHOLD = 10;
const MIN_ACCELERATION = -0.1;
const MAX_ACCELERATION = 0.1;
const OUTSIDE_HEIGHT = 200;
const START_VELOCITY = 0.1;
const MIN_VELOCITY = -6; // 6*60 = -360 px/s
const MAX_VELOCITY = 6; // 6*60 = 360 px/s
const MID_VIEW_RATIO = 0.4; // Middl'ish

const DEFAULT_SCROLL_DATA = {
  active: null,
  activeComplete: null,
  activeIndex: null,
  animationRequest: null,
  delta: 0,
  dispatch: null,
  skipTop: null,
  next: null,
  humanTimeout: 0,
  scroll: null,
  state: null,
  velocity: 0,
};

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "100%",
    height: "100%",
    padding: "1rem 2rem",
    overflow: "hidden",
    overflowY: "scroll",
  },
}));

// const scrollLog = throttle(console.log, 500);
const scrollError = throttle(console.error, 5000);

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

const updateScroll = (data) => {
  const { scroll } = data;
  scroll.scrollTop = scroll.el.scrollTop;
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

const checkHumanScroll = (data) => {
  const { dispatch, scroll, state } = data;
  const lastScrollTop = scroll.lastScrollTop;
  const scrollTop = scroll.scrollTop;
  if (
    _isFinite(lastScrollTop) &&
    Math.abs(scrollTop - lastScrollTop) > HUMAN_SCROLL_THRESHOLD
  ) {
    console.log("human scroll detected");
    data.humanTimeout = HUMAN_SCROLL_TIMEOUT;
    data.velocity = state?.playing ? START_VELOCITY : 0;
    data.acceleration = 0;
  } else if (data.humanTimeout > 0) {
    // Triggered from previous cycle
    if (state?.chant && data.humanTimeout == HUMAN_SCROLL_TIMEOUT) {
      // TODO: Set the durationTimeout dependent on the percentage up or down
      // the particular node.
      const activeIndex = getTextIndexInView(scroll.el, state.chant.textCount);
      if (activeIndex) dispatch?.({ type: "SET_ACTIVE_INDEX", activeIndex });
    }
    data.humanTimeout -= 1;
  }
  scroll.lastScrollTop = scrollTop;
};

const updateVelocity = (data) => {
  const { active, activeComplete, next, humanTimeout, scroll, state } = data;

  if (!active || !state?.chant || !state?.playing) {
    data.velocity = data.velocity / 2;
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
  const idealVelocity = (speed * targetHeight) / (targetDuration * 60);

  const midHeight = parseInt(scroll.clientHeight * MID_VIEW_RATIO);
  const activeCompleteHeight = parseInt(
    active.clientHeight * (activeComplete ?? 1)
  );
  const idealTop = active.offsetTop + activeCompleteHeight - midHeight;
  const diffTop = idealTop - scroll.scrollTop;
  const minDiffTop = -(midHeight + OUTSIDE_HEIGHT);
  const maxDiffTop = scroll.clientHeight - (midHeight - OUTSIDE_HEIGHT);

  if (!humanTimeout && (diffTop < minDiffTop || maxDiffTop < diffTop)) {
    data.delta = 0;
    data.velocity = START_VELOCITY;
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
    scroll.lastScrollTop = null;
    scroll.el.scrollTo({ top, left: 0 });
  } else {
    const delta = data.delta + velocity;
    const jump = parseInt(delta);
    const top = scroll.scrollTop + jump;
    scroll.lastScrollTop = top;
    data.delta = delta - jump;
    if (Math.abs(jump) > 0) {
      scroll.el.scrollTo({ top, left: 0 });
    }
  }
};

const incrementActive = (data) => {
  const { active, activeComplete, dispatch, state } = data;
  if (!state?.playing) return;
  if (activeComplete >= 1) {
    dispatch?.({ type: "INCREMENT_ACTIVE_INDEX" });
    data.activeComplete = null;
  } else if (active && _isFinite(activeComplete)) {
    data.activeComplete += 1 / (60 * active.duration);
  } else {
    // START, END
    data.activeComplete = 1;
  }
};

const scrollLoop = (data) => {
  data.animationRequest = null;
  try {
    updateScroll(data);
    updateActive(data);
    updateNext(data);
    checkHumanScroll(data);
    updateVelocity(data);
    executeScroll(data);
    incrementActive(data);
  } catch (error) {
    scrollError(error);
  }
  data.animationRequest = window.requestAnimationFrame(() => scrollLoop(data));
};

const ChantScroller = ({ children, dispatch, state }) => {
  const domRef = useRef();
  const scrollRef = useRef();
  const classes = useStyles({ highlight: state.highlight });

  useEffect(() => {
    let data = scrollRef.current;
    const scroll = { el: domRef.current };
    if (data) {
      data.scroll = scroll;
    } else {
      data = scrollRef.current = { ...DEFAULT_SCROLL_DATA, scroll };
    }
    scrollLoop(data);
    return () => {
      if (data.animationRequest) {
        window.cancelAnimationFrame(data.animationRequest);
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.dispatch = dispatch;
      scrollRef.current.state = state;
    } else {
      scrollRef.current = { ...DEFAULT_SCROLL_DATA, dispatch, state };
    }
  }, [dispatch, state]);

  return (
    <div className={classes.root} ref={domRef}>
      {children}
    </div>
  );
};

export default ChantScroller;

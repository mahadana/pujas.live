// timing: object
//
//   id:       string, optional, default null
//   mediaUrl: string, optional, default null
//   start:    float, optional, default 0
//   end:      float, optional, default null
//   nodes:    array of objects
//
// node: object
//
//   hash:  string, optional, default null
//          first 8 characters of hex sha1 of html
//          used to reconstruct if source gets out of sync with timing
//   start: float, optional, default null
//          must be greater or equal prior node.start, node.end, timing.start
//   end:   float, optional, default null
//          must be greater or equal to start, prior node.start, prior
//          node.end, timing.start
//          cannot be supplied if start not supplied

import _isFinite from "lodash/isFinite";
import _isNil from "lodash/isNil";
import _isObject from "lodash/isObject";
import _omitBy from "lodash/omitBy";

const LOCAL_STORAGE_TIMING_KEY = "chantrain";

export const bindInteger = (value, min, max) => {
  value = parseInt(value);
  if (_isFinite(value)) {
    if (value < min) {
      return min;
    } else if (_isFinite(max) && value > max) {
      return max;
    } else {
      return value;
    }
  } else {
    return min;
  }
};

export const convertHumanToTime = (human) => {
  const match = String(human)
    .trim()
    .match(/^(?:(\d+):)??(?:(\d+):)?(\d+(?:\.\d+)?)$/);
  if (match) {
    return 3600 * (match[1] || 0) + 60 * (match[2] || 0) + parseFloat(match[3]);
  } else {
    return null;
  }
};

export const convertTimeToHuman = (time, decimals = 0) => {
  time = parseFloat(time);
  if (isNaN(time)) {
    return "";
  } else {
    const hours = parseInt(time / 3600);
    const minutes = parseInt((time - hours * 3600) / 60);
    const seconds = time - hours * 3600 - minutes * 60;
    return (
      (hours > 0 ? String(hours) + ":" : "") +
      String(minutes) +
      ":" +
      seconds.toFixed(decimals).padStart(decimals == 0 ? 2 : 3 + decimals, "0")
    );
  }
};

export const createChantMappings = (chant) => {
  const nodes = [];
  let index = 0;
  const copyNode = (node) => {
    const newNode = { ...node };
    if (newNode.html) {
      newNode.index = index++;
      nodes.push(newNode);
    } else if (newNode.children) {
      newNode.children = node.children.map?.(copyNode);
    }
    return newNode;
  };
  return { nodes, form: copyNode(chant) };
};

export const exportTiming = (timing) => {
  timing = _omitBy(normalizeTiming(timing), _isNil);
  timing.nodes = timing.nodes.map((node) => _omitBy(node, _isNil));
  return timing;
};

export const exportTimingToStore = (key, timing) => {
  const timingStore = getTimingStore();
  timingStore[key] = timing;
  const jsonStore = JSON.stringify(timingStore);
  window?.localStorage?.setItem?.(LOCAL_STORAGE_TIMING_KEY, jsonStore);
};

const getIndexGeneric = (dim, v, { v1, v2, r1, r2, scaler }) => {
  const nodes = dim.nodes;
  const count = nodes.length;
  let index = parseInt(scale(v, dim[v1], dim[v2], 0, count));
  let prev = null;
  let step = null;

  while (0 <= index && index < count) {
    const node = nodes[index];
    if (v < node[v1]) {
      if (step === null) {
        step = -1;
      } else if (step === 1) {
        return ["<", index, scaler(v, prev[v2], node[v1], prev[r2], node[r1])];
      }
    } else if (v >= node[v2]) {
      if (step === null) {
        step = 1;
      } else if (step === -1) {
        return [">", index, scaler(v, node[v2], prev[v1], node[r2], prev[r1])];
      }
    } else {
      return ["=", index, scaler(v, node[v1], node[v2], node[r1], node[r2])];
    }
    index += step;
    prev = node;
  }

  if (v < dim[v1]) {
    v = dim[v1];
    return ["<", 0, scaler(v, dim[v1], dim[v2], dim[r1], dim[r2])];
  } else if (v >= dim[v2]) {
    v = dim[v2];
    return [">", count - 1, scaler(v, dim[v1], dim[v2], dim[r1], dim[r2])];
  } else if (step === -1) {
    return ["<", 0, scaler(v, dim[v1], prev[v1], dim[r1], prev[r1])];
  } else if (step === 1) {
    return [">", count - 1, scaler(v, prev[v2], dim[v2], prev[r2], dim[r2])];
  } else {
    return ["?", 0, scaler(v, dim[v1], dim[v2], dim[r1], dim[r2])];
  }
};

export const getIndexInterPosition = (dim, pos) => {
  const [type, index, perc] = getIndexGeneric(dim, pos, {
    v1: "top",
    v2: "bottom",
    r1: "top",
    r2: "bottom",
    scaler: (v, a, b) => scale(v, a, b, 0, 1),
  });
  if (type === "=") {
    return ["in", index, perc];
  } else {
    return ["gap", index + (type === ">" ? 1 : 0), perc];
  }
};

export const getIndexInterTime = (dim, time) => {
  const [type, index, perc] = getIndexGeneric(dim, time, {
    v1: "start",
    v2: "end",
    r1: "start",
    r2: "end",
    scaler: (v, a, b) => scale(v, a, b, 0, 1),
  });
  if (type === "=") {
    return ["in", index, perc];
  } else {
    return ["gap", index + (type === ">" ? 1 : 0), perc];
  }
};

export const getIndexPositionFromTime = (dim, time) => {
  const [type, index, pos] = getIndexGeneric(dim, time, {
    v1: "start",
    v2: "end",
    r1: "top",
    r2: "bottom",
    scaler: (...args) => parseInt(0.5 + scale(...args)),
  });
  return [type === "=" ? index : null, pos];
};

export const getIndexTimeFromPosition = (dim, pos) => {
  const [type, index, time] = getIndexGeneric(dim, pos, {
    v1: "top",
    v2: "bottom",
    r1: "start",
    r2: "end",
    scaler: scale,
  });
  return [type === "=" ? index : null, time];
};

// Assumes timing is normalized
export const interpolateTiming = (timing) => {
  const nodes = [];
  let lastEnd = timing.start;
  let trailIndex = null;

  const updateTrails = (currentIndex, end) => {
    if (trailIndex !== null) {
      const interval = currentIndex - trailIndex;
      const nthTime = (n) => {
        const time = lastEnd + ((end - lastEnd) * n) / interval;
        return parseFloat(time.toFixed(1));
      };
      for (let n = 0; n < interval; n++) {
        nodes.push({ start: nthTime(n), end: nthTime(n + 1) });
      }
      lastEnd = end;
      trailIndex = null;
    }
  };

  timing.nodes.forEach(({ start, end }, index) => {
    if (_isFinite(start)) {
      updateTrails(index, start);
      if (_isFinite(end)) {
        nodes.push({ start, end });
        trailIndex = null;
        lastEnd = end;
      } else {
        trailIndex = index;
        lastEnd = start;
      }
    } else if (trailIndex === null) {
      trailIndex = index;
    }
  });

  const end = _isFinite(timing.end) ? timing.end : lastEnd;
  updateTrails(timing.nodes.length, end);
  return { ...timing, end, nodes };
};

export const getTimingStore = () => {
  let timingStore = null;
  const jsonStore = window?.localStorage?.getItem?.(LOCAL_STORAGE_TIMING_KEY);
  try {
    timingStore = JSON.parse(jsonStore);
  } catch {
    //
  }
  return _isObject(timingStore) ? timingStore : {};
};

export const importTimingFromStore = (key) => getTimingStore()[key] ?? null;

export const normalizeDimension = (dim) => {
  const top = bindInteger(dim?.top, 0);
  const bottom = bindInteger(dim?.bottom, top);
  return {
    top,
    bottom,
    nodes:
      dim?.nodes?.map?.((node) => {
        const nodeTop = bindInteger(node?.top, top, bottom);
        const nodeBottom = bindInteger(node?.bottom, nodeTop, bottom);
        return { top: nodeTop, bottom: nodeBottom };
      }) ?? [],
  };
};

export const normalizeTiming = (timing, size) => {
  let { id, mediaUrl, start, end, nodes } = _isObject(timing) ? timing : {};

  id = _isNil(id) ? null : String(id);
  mediaUrl = _isNil(mediaUrl) ? null : String(mediaUrl);
  start = _isNil(start) ? 0 : humanToTime(start);
  if (!_isFinite(start) || start < 0) start = 0;
  end = _isNil(end) ? null : humanToTime(end);
  if (!_isFinite(end) || end <= start) end = null;
  nodes = Array.isArray(nodes) ? nodes : [];
  if (!_isFinite(size) || size < 0) size = nodes.length;

  let lastStart = start;
  let lastEnd = null;
  const newNodes = [];
  for (let index = 0; index < size; index++) {
    const node = nodes[index];
    let nodeStart = humanToTime(node?.start);
    let nodeEnd = humanToTime(node?.end);
    if (
      !_isFinite(nodeStart) ||
      nodeStart < lastStart ||
      (_isFinite(lastEnd) && nodeStart < lastEnd) ||
      (_isFinite(end) && nodeStart > end)
    ) {
      nodeStart = null;
    }
    if (
      !_isFinite(nodeStart) ||
      !_isFinite(nodeEnd) ||
      nodeEnd < nodeStart ||
      (_isFinite(end) && nodeEnd > end)
    ) {
      nodeEnd = null;
    }
    if (_isFinite(nodeStart)) {
      lastStart = nodeStart;
      lastEnd = nodeEnd;
    }
    newNodes.push({ start: nodeStart, end: nodeEnd });
  }

  return { id, mediaUrl, start, end, nodes: newNodes };
};

// assumes dim is normalized
export const orderDimension = (dim) => {
  let lastBottom = dim.top;
  return {
    ...dim,
    nodes: dim.nodes.map(({ top, bottom }) => {
      if (top < lastBottom) top = lastBottom;
      if (top > dim.bottom) top = dim.bottom;
      if (bottom < top) bottom = top;
      if (bottom > dim.bottom) bottom = dim.bottom;
      lastBottom = bottom;
      return { top, bottom };
    }),
  };
};

export const scale = (v, vMin, vMax, wMin, wMax) => {
  const divisor = vMax - vMin;
  if (divisor == 0) {
    return (wMin + wMax) / 2;
  } else {
    return (wMin * (vMax - v) + wMax * (v - vMin)) / divisor;
  }
};

// assumes dim is normalized
export const staggerRowsInDimension = (dim) => {
  const nodes = [];
  let row = [];
  dim.nodes.forEach((node, index) => {
    const next = dim.nodes[index + 1];
    if (
      next &&
      node.top === next.top &&
      node.bottom - node.top > 2 &&
      next.bottom - next.top > 2
    ) {
      row.push(node);
    } else if (row.length > 0) {
      row.push(node);
      const top = node.top;
      const bottom = Math.max(...row.map((node) => node.bottom));
      const nth = (n) =>
        top + parseInt(0.5 + ((bottom - top) * n) / row.length);
      row.forEach((_, n) => nodes.push({ top: nth(n), bottom: nth(n + 1) }));
      row = [];
    } else {
      nodes.push(node);
    }
  });
  return { top: dim.top, bottom: dim.bottom, nodes };
};

export const humanToTime = convertHumanToTime;
export const timeToHuman = convertTimeToHuman;

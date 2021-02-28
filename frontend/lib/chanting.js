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

// Assumes timing is normalized
export const addExplicitTiming = (timing) => {
  const nodes = timing.nodes;
  let lastNoEndIndex = null;
  let lastEnd = timing.start;

  const updateThroughLastNoEndNode = (index, start) => {
    for (let i = lastNoEndIndex; i < index; i++) {
      if (_isFinite(nodes[i].start)) {
        nodes[i].end = lastEnd = start;
      } else {
        nodes[i].start = nodes[i].end = lastEnd = start;
      }
    }
  };

  nodes.forEach((node, index) => {
    const { start, end } = node;
    if (_isFinite(start)) {
      if (lastNoEndIndex !== null) {
        updateThroughLastNoEndNode(index, start);
      }
      if (_isFinite(end)) {
        lastNoEndIndex = null;
        lastEnd = end;
      } else {
        lastNoEndIndex = index;
        lastEnd = start;
      }
    } else {
      node.start = node.end = null;
      if (lastNoEndIndex === null) lastNoEndIndex = index;
    }
  });

  if (lastNoEndIndex !== null) {
    updateThroughLastNoEndNode(
      nodes.length,
      _isFinite(timing.end) ? timing.end : lastEnd
    );
  }

  if (!_isFinite(timing.end)) timing.end = lastEnd;

  return timing;
};

export const exportTiming = (timing) => {
  timing = _omitBy(normalizeTiming(timing), _isNil);
  timing.nodes = timing.nodes.map((node) => _omitBy(node, _isNil));
  return timing;
};

export const exportTimingToStore = (key, timing) => {
  const store = getStore();
  store[key] = timing;
  const jsonStore = JSON.stringify(store);
  window?.localStorage?.setItem?.(LOCAL_STORAGE_TIMING_KEY, jsonStore);
};

export const getChantNodes = (chant) => {
  const nodes = [];
  let index = 0;
  const walkNode = (node) => {
    if (node?.html) {
      nodes.push({
        ...node,
        index: index++,
      });
    } else if (node?.children) {
      node.children?.forEach?.(walkNode);
    }
  };
  walkNode(chant);
  return nodes;
};

// Assumes timing is normalized with explicit times
export const getIndexWithTime = (timing, time) => {
  if (!_isFinite(time)) return null;
  let index = 0;
  for (const node of timing.nodes) {
    if (node.start <= time && time < node.end) return index;
    index += 1;
  }
  return null;
};

const getStore = () => {
  let store = null;
  const jsonStore = window?.localStorage?.getItem?.(LOCAL_STORAGE_TIMING_KEY);
  try {
    store = JSON.parse(jsonStore);
  } catch {
    //
  }
  if (!_isObject(store)) store = {};
  return store;
};

export const importTimingFromStore = (key) => getStore()[key] ?? null;

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

export const humanToTime = (human) => {
  const match = String(human)
    .trim()
    .match(/^(?:(\d+):)??(?:(\d+):)?(\d+(?:\.\d+)?)$/);
  if (match) {
    return 3600 * (match[1] || 0) + 60 * (match[2] || 0) + parseFloat(match[3]);
  } else {
    return null;
  }
};

export const timeToHuman = (time, decimals = 0) => {
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

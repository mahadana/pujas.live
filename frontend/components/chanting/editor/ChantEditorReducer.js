import _isNil from "lodash/isNil";
import { useReducer } from "react";

import {
  createChantMappings,
  exportTiming,
  normalizeTiming,
  humanToTime,
} from "@/lib/chanting";

const importTiming = (timing, chant) => {
  const chantNodes = createChantMappings(chant).nodes;
  timing = normalizeTiming(timing, chantNodes.length);
  timing.id = chant.id;
  timing.nodes = timing.nodes.map((timingNode, index) => ({
    ...chantNodes[index],
    ...timingNode,
  }));
  return timing;
};

const normalizeTime = (time) => {
  if (!_isNil(time)) {
    time = humanToTime(time);
    if (!_isNil(time)) {
      return parseFloat(time.toFixed(1));
    }
  }
  return null;
};

const withExport = (state) => {
  state.exportedTiming = state.timing ? exportTiming(state.timing) : null;
  return state;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "IMPORT_TIMING": {
      return withExport({
        ...state,
        timing: importTiming(action.importedTiming, state.chant),
      });
    }
    case "RESET_TIMING":
      return withExport({ ...state, timing: null });
    case "SET_MEDIA_PLAYER":
      return { ...state, mediaPlayer: action.mediaPlayer };
    case "SET_PLAYBACK_RATE":
      return { ...state, playbackRate: action.playbackRate };
    case "SET_TIMING_END": {
      let { timing } = state;
      if (timing) timing = { ...timing, end: normalizeTime(action.end) };
      return withExport({ ...state, timing });
    }
    case "SET_TIMING_MEDIA_URL": {
      let { timing } = state;
      if (timing) {
        timing = { ...timing, mediaUrl: action.mediaUrl };
      }
      return withExport({ ...state, timing });
    }
    case "SET_TIMING_START": {
      let { timing } = state;
      if (timing) timing = { ...timing, start: normalizeTime(action.start) };
      return withExport({ ...state, timing });
    }
    case "UPDATE_NODE": {
      let { timing } = state;
      if (timing) {
        timing = { ...timing };
        const node = timing.nodes[action.index];
        if (node) {
          node.start = normalizeTime(action.start);
          node.end = normalizeTime(action.end);
        }
      }
      return withExport({ ...state, timing });
    }
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
};

const initializer = ({ chant }) => {
  return {
    chant,
    exportedTiming: null,
    playbackRate: 1.0,
    timing: null,
  };
};

export const useChantEditorReducer = ({ chant }) =>
  useReducer(reducer, { chant }, initializer);

import _isFinite from "lodash/isFinite";
import _isObject from "lodash/isObject";
import { useReducer } from "react";

export const timeToHuman = (time) => {
  time = parseFloat(time);
  if (isNaN(time)) {
    return "";
  } else {
    const minutes = parseInt(time / 60);
    const seconds = time - minutes * 60;
    return String(minutes) + ":" + seconds.toFixed(1).padStart(4, "0");
  }
};

export const humanToTime = (human) => {
  const match = String(human)
    .trim()
    .match(/^(?:(\d+):)?(\d+(?:\.\d+)?)$/);
  if (match) {
    return 60 * (match[1] || 0) + parseFloat(match[2]);
  } else {
    return undefined;
  }
};

const getStore = () => {
  let store = null;
  const jsonStore = window.localStorage.getItem("chantrain");
  try {
    store = JSON.parse(jsonStore);
  } catch {
    //
  }
  if (!_isObject(store)) store = {};
  return store;
};

export const importTimingFromStore = (chantId) => getStore()[chantId];

export const exportTimingToStore = (chantId, exportedTiming) => {
  const store = getStore();
  store[chantId] = exportedTiming;
  window.localStorage.setItem("chantrain", JSON.stringify(store));
};

const normalizeTime = (time) => {
  time = parseFloat(time);
  return _isFinite(time) ? (time >= 0 ? time : undefined) : undefined;
};

const normalizeTimeNode = (time) => {
  const start = normalizeTime(time.start);
  let end = normalizeTime(time.end);
  if (isFinite(end) && (!isFinite(start) || start > end)) {
    end = undefined;
  }
  return {
    index: parseInt(time.index),
    start,
    end,
    html: String(time.html),
  };
};

const exportTiming = (timing) => ({
  id: timing?.id ? String(timing.id) : undefined,
  mediaUrl: timing?.mediaUrl ? String(timing.mediaUrl) : undefined,
  times:
    timing?.times?.map?.((time) => {
      time = normalizeTimeNode(time);
      return { start: time.start, end: time.end };
    }) ?? [],
});

const getTimesFromChant = (chant, savedTimes) => {
  const times = [];
  let index = 0;

  const walkNode = (node) => {
    if (node?.html) {
      times.push(
        normalizeTimeNode({
          index: index++,
          start: node.start,
          end: node.end,
          html: String(node.html),
        })
      );
    } else if (node?.children) {
      node.children?.forEach?.(walkNode);
    }
  };
  walkNode(chant);

  if (Array.isArray(savedTimes)) {
    times.forEach((time, index) => {
      let savedTime = savedTimes[index];
      if (_isObject(savedTime)) {
        savedTime = normalizeTimeNode(savedTime);
        time.start = savedTime.start;
        time.end = savedTime.end;
      }
    });
  }

  return times;
};

const getTimingFromChant = (chant, savedTiming) => {
  const timing = {
    id: String(chant.id),
    mediaUrl: null,
    times: null,
  };
  if (_isObject(savedTiming)) {
    if (savedTiming.mediaUrl) {
      timing.mediaUrl = String(savedTiming.mediaUrl);
    }
    timing.times = getTimesFromChant(chant, savedTiming.times);
  } else {
    timing.times = getTimesFromChant(chant);
  }
  return timing;
};

export const getActiveTimes = (times, currentTime) => {
  const activeTimes = {};
  let lastNoEndIndex = null;

  if (!_isFinite(currentTime)) return activeTimes;

  times.forEach((time, index) => {
    const { start, end } = time;
    if (_isFinite(start)) {
      if (lastNoEndIndex !== null) {
        if (currentTime < start) {
          activeTimes[lastNoEndIndex] = true;
        }
        lastNoEndIndex = null;
      }
      if (start <= currentTime) {
        if (_isFinite(end)) {
          if (currentTime < end) {
            activeTimes[index] = true;
          }
        } else {
          lastNoEndIndex = index;
        }
      }
    }
  });

  if (_isFinite(lastNoEndIndex)) activeTimes[lastNoEndIndex] = true;

  return activeTimes;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CLOSE_TIME_DIALOG":
      return { ...state, editTime: null };
    case "IMPORT_TIMING": {
      const timing = getTimingFromChant(state.chant, action.importedTiming);
      return {
        ...state,
        exportedTiming: exportTiming(timing),
        timing,
      };
    }
    case "OPEN_TIME_DIALOG":
      return { ...state, editTime: state.timing?.times?.[action.index] };
    case "RESET_TIMING":
      return {
        ...state,
        exportedTiming: exportTiming(null),
        timing: null,
      };
    case "SET_MEDIA_PLAYER":
      return { ...state, mediaPlayer: action.mediaPlayer };
    case "SET_MEDIA_URL": {
      let { timing } = state;
      if (timing) {
        timing = { ...timing, mediaUrl: action.mediaUrl };
      }
      const exportedTiming = exportTiming(timing);
      return { ...state, exportedTiming, timing };
    }
    case "TOGGLE_VIEW": {
      const view = state.view === "EDIT" ? "STYLED" : "EDIT";
      return { ...state, view };
    }
    case "UPDATE_NODE": {
      let { timing } = state;
      if (timing) {
        timing = { ...timing };
        const time = timing.times[action.index];
        if (time) {
          timing.times[action.index] = normalizeTimeNode({
            ...time,
            start: action.start,
            end: action.end,
          });
        }
      }
      const exportedTiming = exportTiming(timing);
      return { ...state, exportedTiming, timing };
    }
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
};

const initializer = ({ chant }) => {
  return {
    chant,
    editTime: null,
    exportedTiming: exportTiming(null),
    mediaUrlDialog: false,
    timing: null,
    view: "EDIT",
  };
};

export const useChantEditorReducer = ({ chant }) =>
  useReducer(reducer, { chant }, initializer);

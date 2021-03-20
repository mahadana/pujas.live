import _clamp from "lodash/clamp";
import _isBoolean from "lodash/isBoolean";
import _isFinite from "lodash/isFinite";
import { useReducer } from "react";

import ChantScrollerModel from "@/components/chanting/ChantScrollerModel";

export const DEFAULT_FONT_SIZE = 20;
export const DEFAULT_SPEED = 1.0;
export const FONT_SIZE_STEP = 2;
export const MIN_FONT_SIZE = 12;
export const MIN_SPEED = 0.3;
export const MAX_FONT_SIZE = 40;
export const MAX_SPEED = 3.0;
export const SPEED_STEP = 0.1;

const LOCAL_STORAGE_KEY = "chantScrollerState";

const normalizeStateForLocalStorage = (state) => ({
  audio: _isBoolean(state?.audio) ? state.audio : true,
  diagnostics: _isBoolean(state?.diagnostics) ? state.diagnostics : false,
  fontSize: _isFinite(state?.fontSize)
    ? _clamp(state.fontSize, MIN_FONT_SIZE, MAX_FONT_SIZE)
    : DEFAULT_FONT_SIZE,
  highlight: _isBoolean(state?.highlight) ? state.highlight : false,
  themeType:
    state?.themeType === "light" || state?.themeType === "dark"
      ? state.themeType
      : "light",
});

const loadStateFromLocalStorage = () => {
  let localStorageState;
  try {
    localStorageState = JSON.parse(
      window.localStorage.getItem(LOCAL_STORAGE_KEY)
    );
  } catch {
    localStorageState = null;
  }
  return normalizeStateForLocalStorage(localStorageState);
};

const saveStateToLocalStorage = (state) => {
  const localStorageState = normalizeStateForLocalStorage(state);
  try {
    window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(localStorageState)
    );
  } catch {
    //
  }
  return state;
};

const initialize = ({
  chantData,
  disableAudio = false,
  disableFullScreen = false,
}) => {
  const model = new ChantScrollerModel();
  return {
    chantData,
    chantSet: null,
    close: false,
    controls: false,
    disableAudio,
    disableFullScreen,
    fullScreen: false,
    maximize: model.getDefaultMaximize(),
    model,
    playing: false,
    settings: false,
    speed: DEFAULT_SPEED,
    ...loadStateFromLocalStorage(), // audio, diagnostics, fontSize, highlight, themeType
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CLOSE": {
      if (state.settings) {
        return { ...state, settings: false };
      } else {
        return {
          ...state,
          close: true,
          fullScreen: false,
          maximize: state.model.getDefaultMaximize(),
          playing: false,
        };
      }
    }
    case "DECREASE_SPEED":
      return {
        ...state,
        speed: Math.max(MIN_SPEED, state.speed - SPEED_STEP),
      };
    case "DECREASE_FONT_SIZE":
      return saveStateToLocalStorage({
        ...state,
        fontSize: Math.max(MIN_FONT_SIZE, state.fontSize - FONT_SIZE_STEP),
      });
    case "HIDE_CONTROLS":
      return { ...state, controls: false };
    case "HIDE_SETTINGS":
      return { ...state, settings: false };
    case "INCREASE_SPEED":
      return {
        ...state,
        speed: Math.min(MAX_SPEED, state.speed + SPEED_STEP),
      };
    case "INCREASE_FONT_SIZE":
      return saveStateToLocalStorage({
        ...state,
        fontSize: Math.min(MAX_FONT_SIZE, state.fontSize + FONT_SIZE_STEP),
      });
    case "RESET_FONT_SIZE":
      return saveStateToLocalStorage({ ...state, fontSize: DEFAULT_FONT_SIZE });
    case "RESET_SPEED":
      return { ...state, speed: DEFAULT_SPEED };
    case "SET_CHANT_SET":
      return {
        ...state,
        chantSet: action.chantSet,
        close: state.chantSet && !action.chantSet,
        playing: Boolean(action.chantSet),
      };
    case "SET_FONT_SIZE":
      return saveStateToLocalStorage({ ...state, fontSize: action.fontSize });
    case "SET_FULL_SCREEN":
      return { ...state, fullScreen: action.fullScreen };
    case "SET_MAXIMIZE":
      return { ...state, maximize: action.maximize };
    case "SET_SPEED":
      return { ...state, speed: action.speed };
    case "SHOW_CONTROLS":
      return { ...state, controls: true };
    case "STOP_PLAYING":
      return { ...state, playing: false };
    case "TOGGLE_AUDIO":
      return saveStateToLocalStorage({ ...state, audio: !state.audio });
    case "TOGGLE_DIAGNOSTICS":
      return saveStateToLocalStorage({
        ...state,
        diagnostics: !state.diagnostics,
      });
    case "TOGGLE_FULL_SCREEN":
      return { ...state, fullScreen: !state.fullScreen };
    case "TOGGLE_HIGHLIGHT":
      return saveStateToLocalStorage({ ...state, highlight: !state.highlight });
    case "TOGGLE_PLAYING":
      return { ...state, playing: !state.playing };
    case "TOGGLE_SETTINGS":
      return { ...state, settings: !state.settings };
    case "TOGGLE_THEME_TYPE":
      return saveStateToLocalStorage({
        ...state,
        themeType: state.themeType === "light" ? "dark" : "light",
      });
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
};

export const useChantScrollerReducer = (props) =>
  useReducer(reducer, props, initialize);

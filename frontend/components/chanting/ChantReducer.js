import isMobile from "ismobilejs";
import _clamp from "lodash/clamp";
import _isBoolean from "lodash/isBoolean";
import _isFinite from "lodash/isFinite";
import { useReducer } from "react";

export const DEFAULT_FONT_SIZE = 20;
export const DEFAULT_SPEED = 1.0;
export const FONT_SIZE_STEP = 2;
export const MIN_FONT_SIZE = 12;
export const MIN_SPEED = 0.3;
export const MAX_FONT_SIZE = 40;
export const MAX_SPEED = 3.0;
export const SPEED_STEP = 0.1;

const LOCAL_STORAGE_KEY = "chantState";

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

// This is redundant with ChantModel.getDefaultMaximize()
const getDefaultMaximize = () => {
  if (typeof window === "object") {
    return Boolean(isMobile(window.navigator).phone);
  } else {
    return false;
  }
};

const updateState = (prevState, values) => {
  const nextState = { ...prevState, ...values };
  nextState.chantSet = nextState.tocChantSet || nextState.propsChantSet;
  if (nextState.view === "EMPTY") {
    if (nextState.chantData && nextState.chantSet) {
      nextState.view = "CHANT";
    } else if (nextState.chantData && !nextState.disableToc) {
      nextState.view = "TOC";
    }
  }
  if (nextState.view === "CHANT") {
    if (prevState.view !== "CHANT") nextState.playing = true;
  } else {
    nextState.fullScreen = false;
    nextState.maximize = nextState.defaultMaximize;
  }
  return nextState;
};

const initialize = (values) => {
  const defaultMaximize = getDefaultMaximize();
  return updateState(
    {
      chantData: null,
      chantSet: null,
      controls: false,
      defaultMaximize,
      disableAudio: false,
      disableFullScreen: false,
      disableReturnToc: false,
      disableToc: false,
      fullScreen: false,
      maximize: defaultMaximize,
      playing: false,
      propsChantSet: null,
      settings: false,
      speed: DEFAULT_SPEED,
      tocChantSet: null,
      view: "EMPTY",
      ...loadStateFromLocalStorage(), // audio, diagnostics, fontSize, highlight, themeType
    },
    values
  );
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CLOSE": {
      if (state.view === "CHANT") {
        if (state.settings) {
          return { ...state, settings: false };
        } else {
          const close = state.disableReturnToc || state.disableToc;
          return updateState(state, { view: close ? "CLOSE" : "TOC" });
        }
      } else {
        return updateState(state, { view: "CLOSE" });
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
    case "INITIALIZE":
      return updateState(state, action.values);
    case "RESET_FONT_SIZE":
      return saveStateToLocalStorage({ ...state, fontSize: DEFAULT_FONT_SIZE });
    case "RESET_SPEED":
      return { ...state, speed: DEFAULT_SPEED };
    case "SET_TOC_CHANT_SET":
      return updateState(state, {
        tocChantSet: action.tocChantSet,
        view: action.tocChantSet ? "CHANT" : state.view,
      });
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

export const useChantReducer = (props) =>
  useReducer(reducer, props, initialize);

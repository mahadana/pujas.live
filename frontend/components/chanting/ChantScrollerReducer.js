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

const initialize = ({
  chantData,
  disableAudio = false,
  disableFullScreen = false,
  disableReturnToc = false,
}) => {
  const model = new ChantScrollerModel();
  return {
    audio: false,
    chantData,
    chantSet: null,
    close: false,
    controls: false,
    diagnostics: false,
    disableAudio,
    disableFullScreen,
    disableReturnToc,
    fontSize: DEFAULT_FONT_SIZE,
    fullScreen: false,
    highlight: false,
    maximize: model.getDefaultMaximize(),
    model,
    playing: false,
    settings: false,
    speed: DEFAULT_SPEED,
    themeType: "light",
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CLOSE": {
      if (state.settings && !state.disableReturnToc) {
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
      return {
        ...state,
        fontSize: Math.max(MIN_FONT_SIZE, state.fontSize - FONT_SIZE_STEP),
      };
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
      return {
        ...state,
        fontSize: Math.min(MAX_FONT_SIZE, state.fontSize + FONT_SIZE_STEP),
      };
    case "RESET_FONT_SIZE":
      return { ...state, fontSize: DEFAULT_FONT_SIZE };
    case "RESET_SPEED":
      return { ...state, speed: DEFAULT_SPEED };
    case "SET_CHANT_SET":
      return {
        ...state,
        chantSet: action.chantSet,
        close: !action.chantSet,
        playing: Boolean(action.chantSet),
      };
    case "SET_FONT_SIZE":
      return { ...state, fontSize: action.fontSize };
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
      return { ...state, audio: !state.audio };
    case "TOGGLE_DIAGNOSTICS":
      return { ...state, diagnostics: !state.diagnostics };
    case "TOGGLE_FULL_SCREEN":
      return { ...state, fullScreen: !state.fullScreen };
    case "TOGGLE_HIGHLIGHT":
      return { ...state, highlight: !state.highlight };
    case "TOGGLE_PLAYING":
      return { ...state, playing: !state.playing };
    case "TOGGLE_SETTINGS":
      return { ...state, settings: !state.settings };
    case "TOGGLE_THEME_TYPE":
      return {
        ...state,
        themeType: state.themeType === "light" ? "dark" : "light",
      };
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
};

export const useChantScrollerReducer = (props) =>
  useReducer(reducer, props, initialize);

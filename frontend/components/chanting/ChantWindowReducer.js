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

const initialize = ({ chantData, mobile }) => ({
  audio: true,
  chantData,
  chantSet: null,
  close: false,
  debug: true,
  diagnostics: true,
  fontSize: DEFAULT_FONT_SIZE,
  fullscreen: false,
  fullToc: true,
  highlight: true,
  mobile,
  model: new ChantScrollerModel(),
  playing: false,
  settings: false,
  speed: DEFAULT_SPEED,
  themeType: "light",
  view: "TOC",
});

const reducer = (state, action) => {
  switch (action.type) {
    case "CLOSE": {
      if (state.settings) {
        return { ...state, settings: false };
      } else if (state.view === "CHANT") {
        return {
          ...state,
          chantSet: null,
          fullscreen: false,
          playing: false,
          view: "TOC",
        };
      } else {
        return { ...state, close: true, fullscreen: false, playing: false };
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
    case "EXIT": {
      return { ...state, close: true, fullscreen: false, playing: false };
    }
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
    case "OPEN_CHANT_SET":
      return {
        ...state,
        chantSet: action.chantSet,
        fullscreen: state.mobile,
        playing: true,
        view: "CHANT",
      };
    case "RESET_FONT_SIZE":
      return { ...state, fontSize: DEFAULT_FONT_SIZE };
    case "SET_FONT_SIZE":
      return { ...state, fontSize: action.fontSize };
    case "SET_SPEED":
      return { ...state, speed: action.speed };
    case "STOP_PLAYING":
      return { ...state, playing: false };
    case "TOGGLE_AUDIO":
      return { ...state, audio: !state.audio };
    case "TOGGLE_DEBUG":
      return { ...state, debug: !state.debug };
    case "TOGGLE_DIAGNOSTICS":
      return { ...state, diagnostics: !state.diagnostics };
    case "TOGGLE_FULLSCREEN":
      return { ...state, fullscreen: !state.fullscreen };
    case "TOGGLE_FULL_TOC":
      return { ...state, fullToc: !state.fullToc };
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

export const useChantWindowReducer = (props) =>
  useReducer(reducer, props, initialize);

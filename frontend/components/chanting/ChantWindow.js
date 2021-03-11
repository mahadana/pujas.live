import Fade from "@material-ui/core/Fade";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import { useCallback, useEffect, useReducer } from "react";

import ChantCloseControls from "@/components/chanting/ChantCloseControls";
import ChantOperationControls from "@/components/chanting/ChantOperationControls";
import ChantExtraControls from "@/components/chanting/ChantExtraControls";
import ChantIdleProvider from "@/components/chanting/ChantIdleProvider";
import ChantScroller from "@/components/chanting/ChantScroller";
import ChantScrollerModel from "@/components/chanting/ChantScrollerModel";
import ChantSettingsPanel from "@/components/chanting/ChantSettingsPanel";
import ChantToc from "@/components/chanting/ChantToc";
import darkTheme from "@/lib/theme";
import { exitFullscreen, requestFullscreen } from "@/lib/util";

const lightTheme = createMuiTheme({
  ...darkTheme,
  palette: {
    type: "light",
  },
});

const useStyles = makeStyles((theme) => ({
  root: ({ state }) => ({
    position: "fixed",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    fontSize: "1.25rem",
    ...(state.fullscreen || state.mobile
      ? {
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
        }
      : {
          width: "90vw",
          height: "92vh",
          top: "50%",
          left: "50%",
          marginLeft: "max(-45vw,-24rem)",
          marginTop: "-46vh",
          maxWidth: "48rem",
          borderRadius: "0.25rem",
          boxShadow: "1px 1px 6px rgb(0 0 0 / 80%)",
        }),
  }),
  fade: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
}));

const initialize = ({ chantData, mobile }) => ({
  audio: true,
  chantData,
  chantSet: null,
  close: false,
  debug: true,
  diagnostics: true,
  fontSize: 20,
  fullscreen: false,
  fullToc: true,
  highlight: true,
  mobile,
  model: new ChantScrollerModel(),
  playing: false,
  settings: false,
  speed: 1.0,
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
    case "EXIT": {
      return { ...state, close: true, fullscreen: false, playing: false };
    }
    case "OPEN_CHANT_SET":
      return {
        ...state,
        chantSet: action.chantSet,
        fullscreen: state.mobile,
        playing: true,
        view: "CHANT",
      };
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

// This inner component is needed for the theme to apply.
const ChantWindowInner = ({ dispatch, state }) => {
  const classes = useStyles({ state });

  const onOpenToc = useCallback(
    (chantSet) => dispatch({ type: "OPEN_CHANT_SET", chantSet }),
    [dispatch]
  );

  return (
    <div className={classes.root}>
      <ChantCloseControls dispatch={dispatch} state={state} />
      <ChantOperationControls dispatch={dispatch} state={state} />
      <ChantExtraControls dispatch={dispatch} state={state} />
      <ChantSettingsPanel dispatch={dispatch} state={state} />
      <Fade in={state.view === "CHANT"}>
        <div className={classes.fade}>
          <ChantScroller dispatch={dispatch} state={state} />
        </div>
      </Fade>
      <Fade in={state.view === "TOC"}>
        <div className={classes.fade}>
          <ChantToc
            fullToc={state.fullToc}
            onOpen={onOpenToc}
            toc={state.chantData.toc}
          />
        </div>
      </Fade>
    </div>
  );
};

const ChantWindow = ({
  allowFullscreen = true,
  chantData,
  mobile,
  onClose,
  open,
}) => {
  const reducerDefaults = { chantData, mobile };
  const [state, dispatch] = useReducer(reducer, reducerDefaults, initialize);

  useEffect(() => {
    if (allowFullscreen) {
      if (state.fullscreen) {
        requestFullscreen();
      } else {
        exitFullscreen();
      }
    }
  }, [allowFullscreen, state.fullscreen, state.mobile]);

  useEffect(() => {
    if (state.close) onClose();
  }, [state.close]);

  useEffect(() => {
    if (!open) dispatch({ type: "EXIT" });
  }, [open]);

  const theme = state.themeType === "dark" ? darkTheme : lightTheme;

  return (
    <ChantIdleProvider>
      <ThemeProvider theme={theme}>
        <ChantWindowInner dispatch={dispatch} state={state} />
      </ThemeProvider>
    </ChantIdleProvider>
  );
};

export default ChantWindow;

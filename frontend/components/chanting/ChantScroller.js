import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import clsx from "clsx";
import { memo, useEffect, useRef, useState } from "react";

import ChantSet from "@/components/chanting/ChantSet";
import ChantAudioButton from "@/components/chanting/inputs/ChantAudioButton";
import ChantCloseButton from "@/components/chanting/inputs/ChantCloseButton";
import ChantFullScreenButton from "@/components/chanting/inputs/ChantFullScreenButton";
import ChantPlayButton from "@/components/chanting/inputs/ChantPlayButton";
import ChantSettingsButton from "@/components/chanting/inputs/ChantSettingsButton";
import ChantSettingsPanel from "@/components/chanting/ChantSettingsPanel";
import { useChantScrollerReducer } from "@/components/chanting/ChantScrollerReducer";
import darkTheme from "@/lib/theme";

const lightTheme = createMuiTheme({
  ...darkTheme,
  palette: {
    type: "light",
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    userSelect: "none",
    "& .chant-controls": {
      transition: "top 0.5s ease-out, right 0.5s ease-out, opacity 0.5s ease",
    },
    "&.chant-controls-visible .chant-controls": {
      display: "block",
      opacity: 1,
    },
    "&.chant-controls-hidden .chant-controls": {
      display: "block",
      opacity: 0,
    },
    "&.chant-controls-removed .chant-controls": {
      display: "none",
      opacity: 0,
    },
    "&.chant-controls-removed .chant-scroller": {
      cursor: (fullScreen) => (fullScreen ? "none" : "inherit"),
    },
    "& .chant-diagnostics": {
      display: "none",
    },
    "&.chant-diagnostics-visible .chant-diagnostics": {
      display: "block",
    },
    "&.chant-highlight-visible .chant-active": {
      backgroundColor:
        theme.palette.type === "light"
          ? "rgba(255, 255, 0, 0.25)"
          : "rgba(255, 255, 0, 0.1)",
    },
    "&.chant-settings": {
      transition: "opacity 0.25s ease",
    },
    "&.chant-settings-visible .chant-settings": {
      display: "block",
      opacity: 1,
    },
    "&.chant-settings-hidden .chant-settings": {
      display: "block",
      opacity: 0,
    },
    "&.chant-settings-removed .chant-settings": {
      display: "none",
      opacity: 0,
    },
  },
  close: {
    position: "absolute",
    zIndex: 300,
    top: 0,
    right: 0,
    width: "3.75rem",
    height: "3.75rem",
  },
  diagnostics: {
    position: "absolute",
    zIndex: 500,
    top: 0,
    left: 0,
    width: "100%",
    padding: "4px",
    overflow: "hidden",
    backgroundColor: "black",
    color: "white",
    fontFamily: "monospace",
    fontSize: "min(2vw, 12px)",
    whiteSpace: "nowrap",
  },
  fullScreen: {
    position: "absolute",
    zIndex: 100,
    width: "3.75rem",
    height: "3.75rem",
    [theme.breakpoints.down("xs")]: {
      bottom: 0,
      right: "3.75rem",
    },
    [theme.breakpoints.up("sm")]: {
      bottom: "3.75rem",
      right: 0,
    },
  },
  operations: {
    position: "absolute",
    zIndex: 100,
    [theme.breakpoints.down("xs")]: {
      bottom: 0,
      left: 0,
      width: ({ disableAudio }) => (disableAudio ? "3.75rem" : "7.5rem"),
      height: "3.75rem",
    },
    [theme.breakpoints.up("sm")]: {
      bottom: ({ model }) => (model.hasMaximize() ? "7.5rem" : "3.75rem"),
      right: 0,
      width: "3.75rem",
      height: ({ disableAudio }) => (disableAudio ? "3.75rem" : "7.5rem"),
      textAlign: "center",
      "& > button": {
        display: "flex",
      },
    },
  },
  scroller: {
    position: "absolute",
    zIndex: 0,
    top: 0,
    right: 0,
    width: "100%",
    height: "100%",
    overflowX: "hidden",
    overflowY: "scroll",
    transition: "opacity 1s",
    overscrollBehavior: "none",
    "&:focus": {
      outline: "none",
    },
    "&::-webkit-scrollbar ": {
      display: "none",
    },
    [theme.breakpoints.up("sm")]: {
      padding: "1rem",
    },
  },
  settingsButton: {
    position: "absolute",
    zIndex: 300,
    bottom: 0,
    right: 0,
    width: "3.75rem",
    height: "3.75rem",
  },
  settingsPanel: {
    position: "absolute",
    zIndex: 200,
    width: "100%",
    height: "100%",
  },
}));

// This inner component is needed for the theme switching to work.
const ChantScrollerInner = memo(({ dispatch, state }) => {
  const ref = useRef();
  const [chantSet, setChantSet] = useState(null);
  const classes = useStyles(state);

  const { model } = state;

  useEffect(() => {
    model.attach(ref.current);
    model.setDispatch(dispatch);
    model.setState(state);
    return () => model.detach();
  }, []);

  useEffect(() => {
    model.setDispatch(dispatch);
    model.setState(state, setChantSet);
  }, [dispatch, setChantSet, state]);

  return (
    <div className={classes.root} ref={ref}>
      <div className={clsx(classes.diagnostics, "chant-diagnostics")} />
      <div className={clsx(classes.scroller, "chant-scroller")} tabIndex="0">
        {chantSet && <ChantSet chantSet={chantSet} />}
      </div>
      <div className={clsx(classes.close, "chant-controls")}>
        <ChantCloseButton dispatch={dispatch} />
      </div>
      <div className={clsx(classes.operations, "chant-controls")}>
        <ChantPlayButton dispatch={dispatch} state={state} />
        {!state.disableAudio && (
          <ChantAudioButton dispatch={dispatch} state={state} />
        )}
      </div>
      {model.hasMaximize() && (
        <div className={clsx(classes.fullScreen, "chant-controls")}>
          <ChantFullScreenButton dispatch={dispatch} state={state} />
        </div>
      )}
      <div className={clsx(classes.settingsButton, "chant-controls")}>
        <ChantSettingsButton dispatch={dispatch} state={state} />
      </div>
      <div className={clsx(classes.settingsPanel, "chant-settings")}>
        <ChantSettingsPanel dispatch={dispatch} state={state} />
      </div>
    </div>
  );
});

ChantScrollerInner.displayName = "ChantScrollerInner";

const ChantScroller = memo(
  ({
    chantData,
    chantSet,
    disableAudio,
    disableFullScreen,
    disableReturnToc,
    onClose,
    setMaximize,
  }) => {
    const [state, dispatch] = useChantScrollerReducer({
      chantData,
      disableAudio,
      disableFullScreen,
      disableReturnToc,
    });

    useEffect(() => {
      dispatch({ type: "SET_CHANT_SET", chantSet });
    }, [chantSet]);

    useEffect(() => {
      if (state.close) onClose();
    }, [state.close]);

    useEffect(() => {
      setMaximize?.(state.maximize);
    }, [state.maximize]);

    const theme = state.themeType === "dark" ? darkTheme : lightTheme;

    return (
      <ThemeProvider theme={theme}>
        <ChantScrollerInner dispatch={dispatch} state={state} />
      </ThemeProvider>
    );
  }
);

ChantScroller.displayName = "ChantScroller";

export default ChantScroller;

import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import { memo, useEffect } from "react";

import ChantCloseControls from "@/components/chanting/ChantCloseControls";
import ChantOperationControls from "@/components/chanting/ChantOperationControls";
import ChantExtraControls from "@/components/chanting/ChantExtraControls";
import ChantIdleProvider from "@/components/chanting/ChantIdleProvider";
import ChantScrollerWrapper from "@/components/chanting/ChantScrollerWrapper";
import ChantSettingsPanel from "@/components/chanting/ChantSettingsPanel";
import ChantTocWrapper from "@/components/chanting/ChantTocWrapper";
import { useChantWindowReducer } from "@/components/chanting/ChantWindowReducer";
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
}));

// This inner component is needed for the theme switching to work.
const ChantWindowInner = memo(({ dispatch, state }) => {
  const classes = useStyles({ state });
  return (
    <div className={classes.root}>
      <ChantCloseControls dispatch={dispatch} state={state} />
      <ChantOperationControls dispatch={dispatch} state={state} />
      <ChantExtraControls dispatch={dispatch} state={state} />
      <ChantSettingsPanel dispatch={dispatch} state={state} />
      <ChantScrollerWrapper dispatch={dispatch} state={state} />
      <ChantTocWrapper dispatch={dispatch} state={state} />
    </div>
  );
});

const ChantWindow = ({
  allowFullscreen = true,
  chantData,
  mobile,
  onClose,
  open,
}) => {
  const [state, dispatch] = useChantWindowReducer({ chantData, mobile });

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

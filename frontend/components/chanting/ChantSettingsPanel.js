import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { memo } from "react";

import ChantDiagnosticsButton from "@/components/chanting/inputs/ChantDiagnosticsButton";
import ChantFontSizeSlider from "@/components/chanting/inputs/ChantFontSizeSlider";
import ChantHighlightButton from "@/components/chanting/inputs/ChantHighlightButton";
import ChantSpeedSlider from "@/components/chanting/inputs/ChantSpeedSlider";
import ChantThemeTypeButton from "@/components/chanting/inputs/ChantThemeTypeButton";

const MOBILE_LANDSCAPE_HEIGHT = "500px";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  backdrop: {
    position: "absolute",
    zIndex: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  buttons: {
    textAlign: "center",
    [theme.breakpoints.up("sm")]: {
      [`@media (max-height: 300px)`]: {
        marginTop: "-1rem",
      },
    },
  },
  panel: {
    zIndex: 10,
    position: "absolute",
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.down("xs")]: {
      bottom: 0,
      left: 0,
      width: "100%",
      height: "21rem",
      padding: "1rem 2rem",
    },
    [theme.breakpoints.up("sm")]: {
      bottom: 0,
      right: 0,
      width: "22rem",
      height: "22rem",
      padding: "2rem 2rem 3rem",
      display: "flex",
      flexDirection: "column",
      flexWrap: "nowrap",
      justifyContent: "flex-end",
      borderTopLeftRadius: ({ maximize }) => (maximize ? 0 : "0.25rem"),
      borderBottomRightRadius: ({ maximize }) => (maximize ? 0 : "0.25rem"),
      [`@media (max-height: ${MOBILE_LANDSCAPE_HEIGHT})`]: {
        width: "23rem",
        height: "100%",
        padding: "1rem 4rem 1rem 2rem",
        justifyContent: "space-evenly",
        borderTopRightRadius: ({ maximize }) => (maximize ? 0 : "0.25rem"),
      },
    },
  },
  options: {
    marginBottom: "0.5rem",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      [`@media (max-height: ${MOBILE_LANDSCAPE_HEIGHT})`]: {
        marginBottom: 0,
      },
    },
  },
  slider: {
    height: "6rem",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      [`@media (max-height: ${MOBILE_LANDSCAPE_HEIGHT})`]: {
        height: "5rem",
      },
    },
  },
}));

const ChantSettingsPanel = memo(({ dispatch, state }) => {
  const classes = useStyles({
    maximize: state.fullscreen || state.mobile,
  });

  const close = () => dispatch({ type: "HIDE_SETTINGS" });

  return (
    <div className={classes.root}>
      <div className={classes.panel}>
        <div className={classes.options}>
          <Typography variant="body2">Options</Typography>
          <div className={classes.buttons}>
            <ChantHighlightButton dispatch={dispatch} state={state} />
            <ChantThemeTypeButton dispatch={dispatch} state={state} />
            <ChantDiagnosticsButton dispatch={dispatch} state={state} />
          </div>
        </div>
        <div className={classes.slider}>
          <ChantFontSizeSlider dispatch={dispatch} state={state} />
        </div>
        <div className={classes.slider}>
          <ChantSpeedSlider dispatch={dispatch} state={state} />
        </div>
      </div>
      <div
        className={classes.backdrop}
        onMouseDown={close}
        onTouchStart={close}
      />
    </div>
  );
});

export default ChantSettingsPanel;

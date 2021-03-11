import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import { memo, useState } from "react";

import ChantDiagnosticsButton from "@/components/chanting/inputs/ChantDiagnosticsButton";
import ChantFontSizeSlider from "@/components/chanting/inputs/ChantFontSizeSlider";
import ChantHighlightButton from "@/components/chanting/inputs/ChantHighlightButton";
import ChantSpeedSlider from "@/components/chanting/inputs/ChantSpeedSlider";
import ChantThemeTypeButton from "./inputs/ChantThemeTypeButton";

const HEIGHT_BREAKPOINT = "34rem";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    zIndex: 10,
    bottom: 0,
    left: 0,
    width: ({ visible }) => (visible ? "100%" : 0),
    height: ({ visible }) => (visible ? "16.75rem" : 0),
    [theme.breakpoints.up("sm")]: {
      top: 0,
      right: 0,
      bottom: "auto",
      left: "auto",
      width: ({ visible }) => (visible ? "11.25rem" : 0),
      height: ({ visible }) => (visible ? "100%" : 0),
      [`@media (max-height: ${HEIGHT_BREAKPOINT})`]: {
        width: ({ visible }) => (visible ? "18.75rem" : 0),
      },
    },
  },
  fade: {
    width: "100%",
    height: "100%",
  },
  panel: {
    display: "flex",
    width: "100%",
    height: "100%",
    padding: "1rem",
    borderTop: `1px solid ${theme.palette.text.disabled}`,
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up("sm")]: {
      flexDirection: "column",
      flexWrap: "nowrap",
      justifyContent: "flex-start",
      alignContent: "space-between",
      borderTop: 0,
      borderTopRightRadius: ({ maximize }) => (maximize ? 0 : "0.25rem"),
      borderBottomRightRadius: ({ maximize }) => (maximize ? 0 : "0.25rem"),
      [`@media (max-height: ${HEIGHT_BREAKPOINT})`]: {
        flexWrap: "wrap",
      },
    },
  },
  slider: {
    height: "6rem",
    width: "100%",
    "& p": {
      marginBottom: "0.5rem",
    },
  },
  sliders: {
    marginLeft: "1rem",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: 0,
      [`@media (max-height: ${HEIGHT_BREAKPOINT})`]: {
        order: 1,
        width: "10rem",
        height: "100%",
      },
    },
  },
  options: {
    width: "6.5rem",
    textAlign: "center",
    [theme.breakpoints.up("sm")]: {
      width: "7.5rem",
      marginTop: "-1rem",
      marginLeft: "-1rem",
      marginBottom: "2.75rem",
      textAlign: "right",
    },
    [`@media (max-height: ${HEIGHT_BREAKPOINT})`]: {
      order: 2,
      width: "3.5rem",
      marginLeft: 0,
      marginRight: "2.5rem",
      marginBottom: 0,
    },
  },
}));

const ChantSettingsPanel = memo(
  ({ dispatch, state }) => {
    const [visible, setVisible] = useState(false);
    const classes = useStyles({
      maximize: state.fullscreen || state.mobile,
      visible,
    });

    const onEnter = () => setVisible(true);
    const onExited = () => setVisible(false);

    const open = state.view === "CHANT" && state.settings;

    return (
      <div className={classes.root}>
        <Fade in={open} onEnter={onEnter} onExited={onExited}>
          <div className={classes.fade}>
            <div className={classes.panel}>
              <div className={classes.options}>
                <ChantHighlightButton dispatch={dispatch} state={state} />
                <ChantThemeTypeButton dispatch={dispatch} state={state} />
                <ChantDiagnosticsButton dispatch={dispatch} state={state} />
              </div>
              <div className={classes.sliders}>
                <div className={classes.slider}>
                  <ChantFontSizeSlider dispatch={dispatch} state={state} />
                </div>
                <div className={classes.slider}>
                  <ChantSpeedSlider dispatch={dispatch} state={state} />
                </div>
              </div>
            </div>
          </div>
        </Fade>
      </div>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch &&
    prev.state.diagnostics === next.state.diagnostics &&
    prev.state.fontSize === next.state.fontSize &&
    prev.state.fullscreen === next.state.fullscreen &&
    prev.state.highlight === next.state.highlight &&
    prev.state.mobile === next.state.mobile &&
    prev.state.settings === next.state.settings &&
    prev.state.speed === next.state.speed &&
    prev.state.themeType === next.state.themeType
);

export default ChantSettingsPanel;

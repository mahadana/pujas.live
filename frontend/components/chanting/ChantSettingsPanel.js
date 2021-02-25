import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";

import ChantFontSizeSlider from "@/components/chanting/inputs/ChantFontSizeSlider";
import ChantFullscreenToggle from "@/components/chanting/inputs/ChantFullscreenToggle";
import ChantSpeedSlider from "@/components/chanting/inputs/ChantSpeedSlider";
import ChantThemeTypeToggle from "@/components/chanting/inputs/ChantThemeTypeToggle";

const HEIGHT_BREAKPOINT = "34rem";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    zIndex: 10,
    bottom: "3.75rem",
    left: 0,
    width: ({ visible }) => (visible ? "100%" : 0),
    height: ({ visible }) => (visible ? "13rem" : 0),
    [theme.breakpoints.up("sm")]: {
      top: 0,
      right: 0,
      bottom: "auto",
      left: "auto",
      width: ({ visible }) => (visible ? "12rem" : 0),
      height: ({ visible }) => (visible ? "100%" : 0),
      [`@media (max-height: ${HEIGHT_BREAKPOINT})`]: {
        width: ({ visible }) => (visible ? "23rem" : 0),
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
    overflow: "hidden",
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
  toggle: {
    height: "6rem",
    width: "100%",
    overflow: "hidden",
    "& p": {
      marginBottom: "0.25rem",
    },
  },
  toggles: {
    [`@media (max-height: ${HEIGHT_BREAKPOINT})`]: {
      order: 2,
      width: "10rem",
    },
  },
}));

const ChantSettingsPanel = ({ dispatch, state }) => {
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
            <div className={classes.toggles}>
              <div className={classes.toggle}>
                <ChantFullscreenToggle dispatch={dispatch} state={state} />
              </div>
              <div className={classes.toggle}>
                <ChantThemeTypeToggle dispatch={dispatch} state={state} />
              </div>
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
};

export default ChantSettingsPanel;

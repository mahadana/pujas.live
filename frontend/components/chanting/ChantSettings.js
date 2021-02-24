import { makeStyles } from "@material-ui/core/styles";

import ChantFontSizeSlider from "@/components/chanting/ChantFontSizeSlider";
import ChantFullscreenToggle from "@/components/chanting/ChantFullscreenToggle";
import ChantSpeedSlider from "@/components/chanting/ChantSpeedSlider";
import ChantThemeTypeToggle from "@/components/chanting/ChantThemeTypeToggle";

const HEIGHT_BREAKPOINT = "34rem";

const useStyles = makeStyles((theme) => ({
  root: ({ state }) => ({
    display: "flex",
    position: "absolute",
    zIndex: 10,
    padding: "1rem",
    bottom: 0,
    left: 0,
    width: "100%",
    paddingBottom: "4rem",
    borderTop: `1px solid ${theme.palette.text.disabled}`,
    ...(state.fullscreen || state.mobile
      ? {}
      : {
          borderTopRightRadius: "0.25rem",
          borderBottomRightRadius: "0.25rem",
        }),
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up("sm")]: {
      flexDirection: "column",
      flexWrap: "nowrap",
      justifyContent: "flex-start",
      alignContent: "space-between",
      top: 0,
      right: 0,
      paddingBottom: "1rem",
      borderTop: 0,
      bottom: "auto",
      left: "auto",
      width: "12rem",
      height: "100%",
      [`@media (max-height: ${HEIGHT_BREAKPOINT})`]: {
        width: "23rem",
        flexWrap: "wrap",
      },
    },
  }),
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

const ChantSettings = ({ dispatch, state, ...props }) => {
  const classes = useStyles({ state });
  return (
    <div {...props} className={classes.root}>
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
  );
};

export default ChantSettings;

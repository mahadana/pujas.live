import { makeStyles } from "@material-ui/core/styles";

import ChantThemeTypeToggle from "@/components/chanting/ChantThemeTypeToggle";
import ChantDebugToggle from "@/components/chanting/ChantDebugToggle";
import ChantFontSizeSlider from "@/components/chanting/ChantFontSizeSlider";
import ChantSpeedSlider from "@/components/chanting/ChantSpeedSlider";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    zIndex: 10,
    top: 0,
    right: 0,
    width: "16rem",
    padding: "1.5rem",
    borderRadius: "0.25rem",
    backgroundColor: theme.palette.background.default,
  },
  setting: {
    "&:not(:last-child)": {
      marginBottom: "1.5rem",
    },
  },
}));

const ChantSettings = ({ dispatch, state, ...props }) => {
  const classes = useStyles();

  return (
    <div {...props} className={classes.root}>
      <div className={classes.setting}>
        <ChantThemeTypeToggle dispatch={dispatch} state={state} />
      </div>
      <div className={classes.setting}>
        <ChantDebugToggle dispatch={dispatch} state={state} />
      </div>
      <div className={classes.setting}>
        <ChantFontSizeSlider dispatch={dispatch} state={state} />
      </div>
      <div className={classes.setting}>
        <ChantSpeedSlider dispatch={dispatch} state={state} />
      </div>
    </div>
  );
};

export default ChantSettings;

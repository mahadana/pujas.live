import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import SettingsIcon from "@material-ui/icons/Settings";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    zIndex: 20,
    bottom: 0,
    left: 0,
    width: "100%",
    height: "3.9rem",
    borderTop: `1px solid ${theme.palette.text.disabled}`,
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up("sm")]: {
      top: "59px",
      right: 0,
      bottom: "auto",
      left: "auto",
      width: "auto",
      height: "auto",
      borderTop: "none",
      backgroundColor: "transparent",
      textAlign: "center",
      "& > button": {
        display: "flex",
      },
    },
  },
}));

const ChantControls = ({ dispatch, state, ...props }) => {
  const classes = useStyles({ state });

  const togglePlaying = () => dispatch({ type: "TOGGLE_PLAYING" });
  const toggleSettings = () => dispatch({ type: "TOGGLE_SETTINGS" });

  return (
    <div {...props} className={classes.root}>
      <IconButton onClick={togglePlaying}>
        {state.playing ? (
          <Tooltip title="Pause">
            <PauseCircleOutlineIcon color="disabled" fontSize="large" />
          </Tooltip>
        ) : (
          <Tooltip title="Play">
            <PlayCircleOutlineIcon color="disabled" fontSize="large" />
          </Tooltip>
        )}
      </IconButton>
      <IconButton onClick={toggleSettings}>
        <Tooltip title="Settings">
          {state.settings ? (
            <SettingsIcon color="primary" fontSize="large" />
          ) : (
            <SettingsIcon color="disabled" fontSize="large" />
          )}
        </Tooltip>
      </IconButton>
    </div>
  );
};

export default ChantControls;

import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import CancelIcon from "@material-ui/icons/Cancel";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import SettingsIcon from "@material-ui/icons/Settings";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    zIndex: 20,
    top: 0,
    right: 0,
    width: "3.9rem",
    borderRadius: "0.25rem",
    textAlign: "center",
  },
}));

const ChantControls = ({ dispatch, state, ...props }) => {
  const classes = useStyles();

  const close = () => dispatch({ type: "CLOSE" });
  const toggleMaximize = () => dispatch({ type: "TOGGLE_MAXIMIZE" });
  const togglePlaying = () => dispatch({ type: "TOGGLE_PLAYING" });
  const toggleSettings = () => dispatch({ type: "TOGGLE_SETTINGS" });

  return (
    <div {...props} className={classes.root}>
      <IconButton onClick={close}>
        <Tooltip placement="left" title="Exit">
          <CancelIcon color="disabled" fontSize="large" />
        </Tooltip>
      </IconButton>
      <IconButton onClick={toggleSettings}>
        <Tooltip placement="left" title="Settings">
          {state.settings ? (
            <SettingsIcon color="primary" fontSize="large" />
          ) : (
            <SettingsIcon color="disabled" fontSize="large" />
          )}
        </Tooltip>
      </IconButton>
      <IconButton onClick={toggleMaximize}>
        <Tooltip placement="left" title="Fullscreen">
          {state.maximize ? (
            <FullscreenExitIcon color="disabled" fontSize="large" />
          ) : (
            <FullscreenIcon color="disabled" fontSize="large" />
          )}
        </Tooltip>
      </IconButton>
      <IconButton onClick={togglePlaying}>
        {state.playing ? (
          <Tooltip placement="left" title="Pause">
            <PauseCircleOutlineIcon color="primary" fontSize="large" />
          </Tooltip>
        ) : (
          <Tooltip placement="left" title="Play">
            <PlayCircleOutlineIcon color="disabled" fontSize="large" />
          </Tooltip>
        )}
      </IconButton>
    </div>
  );
};

export default ChantControls;

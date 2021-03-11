import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import { memo } from "react";

const ChantAudioButton = memo(
  ({ dispatch, state }) => {
    const onClick = () => dispatch({ type: "TOGGLE_AUDIO" });
    return (
      <>
        <IconButton onClick={onClick}>
          {state.audio ? (
            <Tooltip title="Mute">
              <VolumeUpIcon
                color={state.settings ? "primary" : "disabled"}
                fontSize="large"
              />
            </Tooltip>
          ) : (
            <Tooltip title="Unmute">
              <VolumeOffIcon color="disabled" fontSize="large" />
            </Tooltip>
          )}
        </IconButton>
      </>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch &&
    prev.state.audio === next.state.audio &&
    prev.state.settings === next.state.settings
);

ChantAudioButton.displayName = "ChantAudioButton";

export default ChantAudioButton;

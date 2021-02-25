import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import { memo } from "react";

const ChantPlayButton = memo(
  ({ dispatch, state }) => {
    const onClick = () => dispatch({ type: "TOGGLE_PLAYING" });

    return (
      <IconButton onClick={onClick}>
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
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch && prev.state.playing === next.state.playing
);

ChantPlayButton.displayName = "ChantPlayButton";

export default ChantPlayButton;

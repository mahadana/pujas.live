import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { memo } from "react";

const ChantPlayButton = memo(
  ({ dispatch, state }) => {
    const onClick = () => dispatch({ type: "TOGGLE_PLAYING" });
    return (
      <IconButton onClick={onClick}>
        {state.playing ? (
          <Tooltip title="Pause (k)">
            <PauseIcon color="disabled" fontSize="large" />
          </Tooltip>
        ) : (
          <Tooltip title="Play (k)">
            <PlayArrowIcon color="disabled" fontSize="large" />
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

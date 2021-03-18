import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import { memo } from "react";

const ChantFullScreenButton = memo(
  ({ dispatch, state }) => {
    const onClick = () => dispatch({ type: "TOGGLE_FULL_SCREEN" });

    return (
      <IconButton onClick={onClick}>
        <Tooltip title="Full screen">
          {state.fullScreen ? (
            <FullscreenExitIcon color="disabled" fontSize="large" />
          ) : (
            <FullscreenIcon color="disabled" fontSize="large" />
          )}
        </Tooltip>
      </IconButton>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch &&
    prev.state.fullScreen === next.state.fullScreen
);

ChantFullScreenButton.displayName = "ChantFullScreenButton";

export default ChantFullScreenButton;

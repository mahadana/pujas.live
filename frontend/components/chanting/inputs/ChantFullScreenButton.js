import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import { memo } from "react";

const ChantFullScreenButton = memo(
  ({ dispatch, onToggle, state }) => {
    const onClick = () => {
      onToggle?.(!state.fullScreen);
      dispatch({ type: "TOGGLE_FULL_SCREEN" });
      // We need to add this here due to iOS not handling fullscreen requests
      // that not triggered in the same event flow.
    };

    return (
      <IconButton onClick={onClick}>
        <Tooltip title="Full screen (f)">
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

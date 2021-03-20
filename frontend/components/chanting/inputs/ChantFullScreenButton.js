import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import { memo } from "react";

const ChantFullScreenButton = memo(
  ({ dispatch, model, state }) => {
    const onClick = () => {
      // We need the following due to iOS not handling fullscreen requests not
      // triggered by a user event.
      model.onToggleFullScreen?.(!state.fullScreen);
      dispatch({ type: "TOGGLE_FULL_SCREEN" });
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
    prev.model === next.model &&
    prev.state.fullScreen === next.state.fullScreen
);

ChantFullScreenButton.displayName = "ChantFullScreenButton";

export default ChantFullScreenButton;

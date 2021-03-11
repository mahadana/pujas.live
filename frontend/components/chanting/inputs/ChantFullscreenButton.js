import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import { memo } from "react";

const ChantFullscreenButton = memo(
  ({ dispatch, state }) => {
    const onClick = () => dispatch({ type: "TOGGLE_FULLSCREEN" });

    return (
      <IconButton onClick={onClick}>
        <Tooltip title="Full screen">
          {state.fullscreen ? (
            <FullscreenExitIcon
              color={state.settings ? "primary" : "disabled"}
              fontSize="large"
            />
          ) : (
            <FullscreenIcon color="disabled" fontSize="large" />
          )}
        </Tooltip>
      </IconButton>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch &&
    prev.state.fullscreen === next.state.fullscreen &&
    prev.state.settings === next.state.settings
);

ChantFullscreenButton.displayName = "ChantFullscreenButton";

export default ChantFullscreenButton;

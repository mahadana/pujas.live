import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import CancelIcon from "@material-ui/icons/Cancel";
import FlipToBackIcon from "@material-ui/icons/FlipToBack";
import { memo } from "react";

const ChantCloseButton = memo(
  ({ dispatch, model, state }) => {
    const onClick = () => {
      // We need the following due to iOS not handling fullscreen requests not
      // triggered by a user event.
      model?.onToggleFullScreen?.(false, true);
      dispatch({ type: "CLOSE" });
    };

    const leave =
      state.settings || !(state.disableReturnToc || state.disableToc);

    return (
      <IconButton onClick={onClick}>
        {leave ? (
          <Tooltip title="Leave (esc)">
            <FlipToBackIcon color="disabled" fontSize="large" />
          </Tooltip>
        ) : (
          <Tooltip title="Close (esc)">
            <CancelIcon color="disabled" fontSize="large" />
          </Tooltip>
        )}
      </IconButton>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch &&
    prev.model === next.model &&
    prev.state.disableReturnToc === next.state.disableReturnToc &&
    prev.state.disableToc === next.state.disableToc &&
    prev.state.settings === next.state.settings
);

ChantCloseButton.displayName = "ChantCloseButton";

export default ChantCloseButton;

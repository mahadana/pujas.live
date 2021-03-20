import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import CancelIcon from "@material-ui/icons/Cancel";
import { memo } from "react";

const ChantCloseButton = memo(
  ({ dispatch, model }) => {
    const onClick = () => {
      // We need the following due to iOS not handling fullscreen requests not
      // triggered by a user event.
      model?.onToggleFullScreen?.(false, true);
      dispatch({ type: "CLOSE" });
    };

    return (
      <IconButton onClick={onClick}>
        <Tooltip title="Close (esc)">
          <CancelIcon color="disabled" fontSize="large" />
        </Tooltip>
      </IconButton>
    );
  },
  (prev, next) => prev.dispatch === next.dispatch && prev.model === next.model
);

ChantCloseButton.displayName = "ChantCloseButton";

export default ChantCloseButton;

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import CancelIcon from "@material-ui/icons/Cancel";
import { memo } from "react";

const ChantCloseButton = memo(
  ({ dispatch }) => {
    const onClick = () => dispatch({ type: "CLOSE" });

    return (
      <IconButton onClick={onClick}>
        <Tooltip title="Exit">
          <CancelIcon color="disabled" fontSize="large" />
        </Tooltip>
      </IconButton>
    );
  },
  (prev, next) => prev.dispatch === next.dispatch
);

ChantCloseButton.displayName = "ChantCloseButton";

export default ChantCloseButton;

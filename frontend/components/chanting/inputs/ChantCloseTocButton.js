import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import CancelIcon from "@material-ui/icons/Cancel";
import { memo } from "react";

const ChantCloseTocButton = memo(({ onClick }) => (
  <IconButton onClick={onClick}>
    <Tooltip title="Exit">
      <CancelIcon color="disabled" fontSize="large" />
    </Tooltip>
  </IconButton>
));

ChantCloseTocButton.displayName = "ChantCloseTocButton";

export default ChantCloseTocButton;

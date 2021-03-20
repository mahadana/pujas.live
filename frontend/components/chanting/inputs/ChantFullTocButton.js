import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import TocIcon from "@material-ui/icons/Toc";
import { memo } from "react";

const ChantFullTocButton = memo(({ fullToc, onClick }) => (
  <IconButton onClick={onClick}>
    <Tooltip title="Full TOC">
      <TocIcon color={fullToc ? "primary" : "disabled"} fontSize="large" />
    </Tooltip>
  </IconButton>
));

ChantFullTocButton.displayName = "ChantFullTocButton";

export default ChantFullTocButton;

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import TocIcon from "@material-ui/icons/Toc";
import { memo } from "react";

const ChantFullTocButton = memo(
  ({ dispatch, state }) => {
    const onClick = () => {
      dispatch({ type: "TOGGLE_FULL_TOC" });
    };

    return (
      <>
        <IconButton onClick={onClick}>
          <Tooltip title="Full TOC">
            <TocIcon
              color={state.fullToc ? "primary" : "disabled"}
              fontSize="large"
            />
          </Tooltip>
        </IconButton>
      </>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch && prev.state.fullToc === next.state.fullToc
);

ChantFullTocButton.displayName = "ChantFullTocButton";

export default ChantFullTocButton;

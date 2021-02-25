import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import HighlightIcon from "@material-ui/icons/Highlight";
import { memo } from "react";

const ChantHighlightButton = memo(
  ({ dispatch, state }) => {
    const onClickHighlight = () => dispatch({ type: "TOGGLE_HIGHLIGHT" });

    return (
      <IconButton onClick={onClickHighlight}>
        <Tooltip title="Highlight">
          <HighlightIcon
            color={state.highlight ? "primary" : "disabled"}
            fontSize="large"
          />
        </Tooltip>
      </IconButton>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch &&
    prev.state.highlight === next.state.highlight
);

ChantHighlightButton.displayName = "ChantHighlightButton";

export default ChantHighlightButton;

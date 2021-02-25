import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import BuildIcon from "@material-ui/icons/Build";
import { memo } from "react";

const ChantDebugButton = memo(
  ({ dispatch, state }) => {
    const onClickDebug = () => dispatch({ type: "TOGGLE_DEBUG" });

    return (
      <IconButton onClick={onClickDebug}>
        <Tooltip title="Debug">
          <BuildIcon
            color={state.debug ? "primary" : "disabled"}
            fontSize="large"
          />
        </Tooltip>
      </IconButton>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch && prev.state.debug === next.state.debug
);

ChantDebugButton.displayName = "ChantDebugButton";

export default ChantDebugButton;

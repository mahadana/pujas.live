import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import { memo } from "react";

const ChantPerformanceButton = memo(
  ({ dispatch, state }) => {
    const onClickPerformance = () => dispatch({ type: "TOGGLE_PERFORMANCE" });

    return (
      <IconButton onClick={onClickPerformance}>
        <Tooltip title="Performance">
          <EqualizerIcon
            color={state.performance ? "primary" : "disabled"}
            fontSize="large"
          />
        </Tooltip>
      </IconButton>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch &&
    prev.state.performance === next.state.performance
);

ChantPerformanceButton.displayName = "ChantPerformanceButton";

export default ChantPerformanceButton;

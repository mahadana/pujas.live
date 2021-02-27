import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import HearingIcon from "@material-ui/icons/Hearing";
import { memo } from "react";

const ChantTimingButton = memo(
  ({ dispatch, state }) => {
    const onClick = () => {
      dispatch({ type: "TOGGLE_USE_TIMING" });
    };

    return (
      <>
        <IconButton onClick={onClick}>
          <Tooltip title="Use timing">
            <HearingIcon
              color={state.useTiming ? "primary" : "disabled"}
              fontSize="large"
            />
          </Tooltip>
        </IconButton>
      </>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch &&
    prev.state.mobile === next.state.mobile &&
    prev.state.useTiming === next.state.useTiming
);

ChantTimingButton.displayName = "ChantTimingButton";

export default ChantTimingButton;

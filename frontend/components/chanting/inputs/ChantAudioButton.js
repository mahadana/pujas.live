import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import HearingIcon from "@material-ui/icons/Hearing";
import { memo } from "react";

const ChantAudioButton = memo(
  ({ dispatch, state }) => {
    const onClick = () => {
      dispatch({ type: "TOGGLE_AUDIO" });
    };

    return (
      <>
        <IconButton onClick={onClick}>
          <Tooltip title="Audio">
            <HearingIcon
              color={state.audio ? "primary" : "disabled"}
              fontSize="large"
            />
          </Tooltip>
        </IconButton>
      </>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch && prev.state.audio === next.state.audio
);

ChantAudioButton.displayName = "ChantAudioButton";

export default ChantAudioButton;

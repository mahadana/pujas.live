import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from "@material-ui/icons/Info";
import { memo } from "react";

const ChantDiagnosticsButton = memo(
  ({ dispatch, state }) => {
    const onClick = () => dispatch({ type: "TOGGLE_DIAGNOSTICS" });
    return (
      <IconButton onClick={onClick}>
        <Tooltip title="Diagnostics">
          <InfoIcon
            color={state.diagnostics ? "primary" : "disabled"}
            fontSize="large"
          />
        </Tooltip>
      </IconButton>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch &&
    prev.state.diagnostics === next.state.diagnostics
);

ChantDiagnosticsButton.displayName = "ChantDiagnosticsButton";

export default ChantDiagnosticsButton;

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import SettingsIcon from "@material-ui/icons/Settings";
import { memo } from "react";

const ChantSettingsButton = memo(
  ({ dispatch, state }) => {
    const onClick = () => dispatch({ type: "TOGGLE_SETTINGS" });

    return (
      <IconButton onClick={onClick}>
        <Tooltip title="Settings (s)">
          {state.settings ? (
            <SettingsIcon color="primary" fontSize="large" />
          ) : (
            <SettingsIcon color="disabled" fontSize="large" />
          )}
        </Tooltip>
      </IconButton>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch &&
    prev.state.settings === next.state.settings
);

ChantSettingsButton.displayName = "ChantSettingsButton";

export default ChantSettingsButton;

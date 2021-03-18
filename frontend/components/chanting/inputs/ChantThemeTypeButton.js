import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness5Icon from "@material-ui/icons/Brightness5";
import { memo } from "react";

const ChantThemeTypeButton = memo(
  ({ dispatch, state }) => {
    const onClick = () => dispatch({ type: "TOGGLE_THEME_TYPE" });
    return (
      <IconButton onClick={onClick}>
        {state.themeType === "light" ? (
          <Tooltip title="Dark colors (c)">
            <Brightness4Icon color="disabled" fontSize="large" />
          </Tooltip>
        ) : (
          <Tooltip title="Light colors (c)">
            <Brightness5Icon color="primary" fontSize="large" />
          </Tooltip>
        )}
      </IconButton>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch &&
    prev.state.themeType === next.state.themeType
);

ChantThemeTypeButton.displayName = "ChantThemeTypeButton";

export default ChantThemeTypeButton;

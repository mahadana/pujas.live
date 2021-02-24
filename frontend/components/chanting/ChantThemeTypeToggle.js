import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness5Icon from "@material-ui/icons/Brightness5";

// https://github.com/mui-org/material-ui/issues/12921
const TooltipToggleButton = ({ children, title, ...props }) => (
  <Tooltip title={title}>
    <ToggleButton {...props}>{children}</ToggleButton>
  </Tooltip>
);

const ChantThemeTypeToggle = ({ dispatch, state }) => {
  const onChange = (event, themeType) => {
    if (themeType) dispatch({ type: "SET_THEME_TYPE", themeType });
  };

  return (
    <>
      <Typography gutterBottom id="chant-debug-toggle">
        Theme: {state.themeType}
      </Typography>
      <ToggleButtonGroup
        aria-label="Theme type"
        exclusive
        onChange={onChange}
        value={state.themeType}
      >
        <TooltipToggleButton aria-label="Light" title="Light" value="light">
          <Brightness5Icon />
        </TooltipToggleButton>
        <TooltipToggleButton aria-label="Dark" title="Dark" value="dark">
          <Brightness4Icon />
        </TooltipToggleButton>
      </ToggleButtonGroup>
    </>
  );
};

export default ChantThemeTypeToggle;

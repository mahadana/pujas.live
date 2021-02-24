import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import BuildIcon from "@material-ui/icons/Build";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";

// https://github.com/mui-org/material-ui/issues/12921
const TooltipToggleButton = ({ children, title, ...props }) => (
  <Tooltip title={title}>
    <ToggleButton {...props}>{children}</ToggleButton>
  </Tooltip>
);

const ChantDebugToggle = ({ dispatch, state }) => {
  const onChange = (event, value) => {
    if (value !== null) dispatch({ type: "SET_DEBUG", debug: value });
  };

  return (
    <>
      <Typography gutterBottom id="chant-debug-toggle">
        Debug: {state.debug ? "on" : "off"}
      </Typography>
      <ToggleButtonGroup
        aria-label="Debug mode"
        aria-labelledby="chant-debug-slider"
        exclusive
        onChange={onChange}
        value={state.debug}
      >
        <TooltipToggleButton aria-label="Off" title="Off" value={false}>
          <SentimentVerySatisfiedIcon />
        </TooltipToggleButton>
        <TooltipToggleButton aria-label="On" title="On" value={true}>
          <BuildIcon />
        </TooltipToggleButton>
      </ToggleButtonGroup>
    </>
  );
};

export default ChantDebugToggle;

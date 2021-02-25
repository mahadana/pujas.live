import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

const useStyles = makeStyles((theme) => ({
  selected: {
    color: `${theme.palette.primary.main} !important`,
  },
}));

// https://github.com/mui-org/material-ui/issues/12921
const TooltipToggleButton = ({ children, title, ...props }) => {
  const classes = useStyles();
  return (
    <Tooltip title={title}>
      <ToggleButton classes={{ selected: classes.selected }} {...props}>
        {children}
      </ToggleButton>
    </Tooltip>
  );
};

const ChantToggleGroup = ({ buttons, onChange, value, ...props }) => {
  const localOnChange = (event, newValue) => {
    if (newValue === null) {
      newValue = value;
      for (const button of buttons) {
        if (button.value !== value) {
          newValue = button.value;
          break;
        }
      }
    }
    onChange?.(newValue);
  };

  return (
    <ToggleButtonGroup
      {...props}
      exclusive
      onChange={localOnChange}
      value={value}
    >
      {buttons.map((button, index) => (
        <TooltipToggleButton
          aria-label={button.title}
          key={index}
          title={button.title}
          value={button.value}
        >
          {button.icon}
        </TooltipToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default ChantToggleGroup;

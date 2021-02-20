import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";

const ChantingSpeedSliderLabel = ({ children, open, value }) => (
  <Tooltip open={open} enterTouchDelay={0} placement="right" title={value}>
    {children}
  </Tooltip>
);

const ChantingSpeedSlider = ({ setSpeed, speed }) => {
  const max = 2.0;
  const min = 0.5;
  const onChange = (event, newValue) => setSpeed(max - newValue);
  const valueLabelFormat = (value) => "x" + (max - value).toFixed(1);
  return (
    <Slider
      getAriaValueText={valueLabelFormat}
      max={max - min}
      min={0}
      onChange={onChange}
      orientation="vertical"
      step={0.1}
      track="inverted"
      value={max - speed}
      valueLabelDisplay="auto"
      valueLabelFormat={valueLabelFormat}
      ValueLabelComponent={ChantingSpeedSliderLabel}
    />
  );
};

export default ChantingSpeedSlider;

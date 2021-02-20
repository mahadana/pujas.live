import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";

const ChantActiveSliderLabel = ({ children, open, value }) => (
  <Tooltip open={open} enterTouchDelay={0} placement="right" title={value}>
    {children}
  </Tooltip>
);

const ChantActiveSlider = ({ activeIndex, setActiveIndex, textCount }) => {
  const max = (textCount || 0) + 1;
  const value =
    activeIndex === "START"
      ? max
      : activeIndex === "END"
      ? 0
      : max - (activeIndex || 0) - 1;

  const onChange = (event, value) =>
    setActiveIndex(
      value >= max ? "START" : value <= 0 ? "END" : max - value - 1
    );
  const valueLabelFormat = (value) =>
    value >= max
      ? "Start"
      : value <= 0
      ? "End"
      : `${(((max - value - 1) * 100) / textCount).toFixed(0)}%`;

  return (
    <Slider
      getAriaValueText={valueLabelFormat}
      max={max}
      min={0}
      onChange={onChange}
      orientation="vertical"
      track="inverted"
      value={value}
      valueLabelDisplay="auto"
      valueLabelFormat={valueLabelFormat}
      ValueLabelComponent={ChantActiveSliderLabel}
    />
  );
};

export default ChantActiveSlider;

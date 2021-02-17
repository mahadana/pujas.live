import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";

const ChantingVerseSliderLabel = ({ children, open, value }) => (
  <Tooltip open={open} enterTouchDelay={0} placement="right" title={value}>
    {children}
  </Tooltip>
);

const ChantingVerseSlider = ({ setVerseIndex, verseCount, verseIndex }) => {
  const max = verseCount + 1;
  const onChange = (event, newValue) => setVerseIndex(max - newValue);
  const valueLabelFormat = (value) =>
    value >= max ? "Start" : value == 0 ? "End" : `Verse ${max - value}`;
  return (
    <Slider
      getAriaValueText={valueLabelFormat}
      max={max}
      min={0}
      onChange={onChange}
      orientation="vertical"
      track="inverted"
      value={max - verseIndex}
      valueLabelDisplay="auto"
      valueLabelFormat={valueLabelFormat}
      ValueLabelComponent={ChantingVerseSliderLabel}
    />
  );
};

export default ChantingVerseSlider;

import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import { useEffect, useState } from "react";

const FONT_STEP_SIZE = 2;
const DEFAULT_FONT_SIZE = 20;
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 40;

const sizedLabel = (label, fontSize) => (
  <span style={{ display: "inline-block", fontSize, marginTop: -fontSize / 3 }}>
    {label}
  </span>
);

const marks = [
  { value: 14, label: sizedLabel("Small", 12) },
  { value: DEFAULT_FONT_SIZE, label: "Normal" },
  {
    value: 28,
    label: sizedLabel("Large", 18),
  },
  { value: 36, label: sizedLabel("Huge", 20) },
];

const ChantingFontSizeSlider = ({ dispatch, state }) => {
  const [fontSize, setFontSize] = useState(state.fontSize);

  useEffect(() => setFontSize(state.fontSize), [state.fontSize]);

  const onChange = (event, value) => setFontSize(value);
  const onChangeCommited = (event, value) =>
    dispatch({ type: "SET_FONT_SIZE", fontSize: value });
  const valueLabelFormat = (value) => `${value}px`;

  return (
    <>
      <Typography gutterBottom id="chant-font-size-slider">
        Text Size
      </Typography>
      <Slider
        aria-labelledby="chant-font-size-slider"
        getAriaValueText={valueLabelFormat}
        marks={marks}
        max={MAX_FONT_SIZE}
        min={MIN_FONT_SIZE}
        onChange={onChange}
        onChangeCommitted={onChangeCommited}
        step={FONT_STEP_SIZE}
        value={fontSize}
        valueLabelDisplay="auto"
        valueLabelFormat={valueLabelFormat}
      />
    </>
  );
};

export default ChantingFontSizeSlider;

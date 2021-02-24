import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import { useEffect, useState } from "react";

const MIN_SPEED = 0.3;
const MAX_SPEED = 3.0;

const marks = [
  { value: -1.0, label: "🐢" },
  { value: -0.65, label: "Slow" },
  { value: 0.0, label: "Normal" },
  { value: 0.65, label: "Fast" },
  { value: 1.0, label: "🐇" },
];

const valueToSpeed = (value) => {
  if (value >= 0) {
    return 1 + (MAX_SPEED - 1) * value;
  } else {
    return 1 + (1 - MIN_SPEED) * value;
  }
};

const speedToValue = (speed) => {
  if (speed >= 1) {
    return (speed - 1) / (MAX_SPEED - 1);
  } else {
    return (speed - 1) / (1 - MIN_SPEED);
  }
};

const ChantingSpeedSlider = ({ dispatch, state }) => {
  const [speed, setSpeed] = useState(state.speed);

  useEffect(() => setSpeed(state.speed), [state.speed]);

  const onChange = (event, value) => setSpeed(valueToSpeed(value));
  const onChangeCommited = (event, value) =>
    dispatch({ type: "SET_SPEED", speed: valueToSpeed(value) });
  const valueLabelFormat = (value) => "x" + valueToSpeed(value).toFixed(1);

  return (
    <>
      <Typography gutterBottom id="chant-speed-slider">
        Speed
      </Typography>
      <Slider
        aria-labelledby="chant-speed-slider"
        getAriaValueText={valueLabelFormat}
        marks={marks}
        max={1.0}
        min={-1.0}
        onChange={onChange}
        onChangeCommitted={onChangeCommited}
        step={0.01}
        value={speedToValue(speed)}
        valueLabelDisplay="auto"
        valueLabelFormat={valueLabelFormat}
      />
    </>
  );
};

export default ChantingSpeedSlider;

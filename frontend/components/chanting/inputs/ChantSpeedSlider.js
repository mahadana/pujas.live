import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { memo, useEffect, useState } from "react";

import { MAX_SPEED, MIN_SPEED } from "@/components/chanting/ChantReducer";

const marks = [
  { value: -0.8, label: "Slow" },
  { value: 0.0, label: "Normal" },
  { value: 0.8, label: "Fast" },
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

const ChantingSpeedSlider = memo(
  ({ dispatch, state }) => {
    const [speed, setSpeed] = useState(state.speed);

    useEffect(() => setSpeed(state.speed), [state.speed]);

    const onChange = (event, value) => setSpeed(valueToSpeed(value));
    const onChangeCommited = (event, value) =>
      dispatch({ type: "SET_SPEED", speed: valueToSpeed(value) });
    const valueLabelFormat = (value) => "x" + valueToSpeed(value).toFixed(1);

    return (
      <>
        <Typography id="chant-speed-slider" variant="body2">
          <Tooltip title="Slower (←) Faster (→)">
            <span>Speed</span>
          </Tooltip>
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
  },
  (prev, next) =>
    prev.dispatch === next.dispatch && prev.state.speed === next.state.speed
);

ChantingSpeedSlider.displayName = "ChantingSpeedSlider";

export default ChantingSpeedSlider;

import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { memo, useEffect, useState } from "react";

import {
  FONT_SIZE_STEP,
  DEFAULT_FONT_SIZE,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
} from "@/components/chanting/ChantScrollerReducer";

const sizedLabel = (label, fontSize) => (
  <span style={{ display: "inline-block", fontSize, marginTop: -fontSize / 3 }}>
    {label}
  </span>
);

const marks = [
  { value: DEFAULT_FONT_SIZE, label: "Normal" },
  {
    value: 34,
    label: sizedLabel("Large", 18),
  },
];

const ChantingFontSizeSlider = memo(
  ({ dispatch, state }) => {
    const [fontSize, setFontSize] = useState(state.fontSize);

    useEffect(() => setFontSize(state.fontSize), [state.fontSize]);

    const onChange = (event, value) => setFontSize(value);
    const onChangeCommited = (event, value) =>
      dispatch({ type: "SET_FONT_SIZE", fontSize: value });
    const valueLabelFormat = (value) => `${value}px`;

    return (
      <>
        <Typography id="chant-font-size-slider" variant="body2">
          <Tooltip title="Smaller (-) Larger (+)">
            <span>Text Size</span>
          </Tooltip>
        </Typography>
        <Slider
          aria-labelledby="chant-font-size-slider"
          getAriaValueText={valueLabelFormat}
          marks={marks}
          max={MAX_FONT_SIZE}
          min={MIN_FONT_SIZE}
          onChange={onChange}
          onChangeCommitted={onChangeCommited}
          step={FONT_SIZE_STEP}
          value={fontSize}
          valueLabelDisplay="auto"
          valueLabelFormat={valueLabelFormat}
        />
      </>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch &&
    prev.state.fontSize === next.state.fontSize
);

ChantingFontSizeSlider.displayName = "ChantingFontSizeSlider";

export default ChantingFontSizeSlider;

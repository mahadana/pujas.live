import TextField from "@material-ui/core/TextField";
import _snakeCase from "lodash/snakeCase";
import { memo, useEffect, useState } from "react";

const ChantEditorTimingField = memo(
  ({ dispatch, fieldName, state, value, ...props }) => {
    const { timing } = state;

    const [localValue, setLocalValue] = useState(value);

    useEffect(() => setLocalValue(value), [timing]);

    const onBlur = (event) =>
      dispatch({
        type: `SET_TIMING_${_snakeCase(fieldName).toUpperCase()}`,
        [fieldName]: event.target.value,
      });

    const onChange = (event) => setLocalValue(event.target.value);

    return (
      <TextField
        {...props}
        disabled={!timing}
        onBlur={onBlur}
        onChange={onChange}
        value={localValue}
      />
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch &&
    prev.fieldName === next.fieldName &&
    prev.state.timing === next.state.timing
);

ChantEditorTimingField.displayName = "ChantEditorTimingField";

export default ChantEditorTimingField;

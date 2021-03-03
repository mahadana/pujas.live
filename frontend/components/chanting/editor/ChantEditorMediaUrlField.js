import TextField from "@material-ui/core/TextField";
import _debounce from "lodash/debounce";
import { memo, useCallback, useEffect, useState } from "react";

const ChantEditorMediaUrlField = memo(
  ({ dispatch, state, ...props }) => {
    const stateMediaUrl = state.timing?.mediaUrl ?? "";

    const [mediaUrl, setMedialUrl] = useState(stateMediaUrl);

    useEffect(() => setMedialUrl(stateMediaUrl), [stateMediaUrl]);

    const dispatchSetMedialUrl = useCallback(
      _debounce(
        (mediaUrl) => dispatch({ type: "SET_MEDIA_URL", mediaUrl }),
        500,
        { trailing: true }
      ),
      [dispatch]
    );

    const onChange = (event) => {
      const mediaUrl = event.target.value;
      setMedialUrl(mediaUrl);
      dispatchSetMedialUrl(mediaUrl);
    };

    return (
      <TextField
        {...props}
        disabled={!state.timing}
        label="Media URL"
        onChange={onChange}
        value={mediaUrl}
      />
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch && prev.state.timing === next.state.timing
);

ChantEditorMediaUrlField.displayName = "ChantEditorMediaUrlField";

export default ChantEditorMediaUrlField;

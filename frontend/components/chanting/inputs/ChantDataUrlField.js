import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import _debounce from "lodash/debounce";
import { memo, useCallback, useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    margin: "2rem 0",
  },
  field: {
    width: "calc(100% - 13rem)",
  },
}));

const ChantDataUrlField = memo(({ onLocal, onProduction, onSet, url }) => {
  const [localUrl, setLocalUrl] = useState(url ?? "");
  const classes = useStyles();

  useEffect(() => setLocalUrl(url ?? ""), [url]);

  const debouncedOnSetUrl = useCallback(
    _debounce((newUrl) => onSet(newUrl), 500, { trailing: true }),
    [onSet]
  );

  const onChange = (event) => {
    const newUrl = event.target.value;
    setLocalUrl(newUrl);
    debouncedOnSetUrl(newUrl);
  };

  return (
    <div className={classes.root}>
      <TextField
        className={classes.field}
        label="Data URL"
        onChange={onChange}
        size="small"
        value={localUrl}
        variant="outlined"
      />
      <Button onClick={onProduction} variant="outlined">
        Production
      </Button>
      <Button onClick={onLocal} variant="outlined">
        Local
      </Button>
    </div>
  );
});

ChantDataUrlField.displayName = "ChantDataUrlField";

export default ChantDataUrlField;

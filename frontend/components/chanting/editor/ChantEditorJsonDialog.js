import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useEffect, useRef, useState } from "react";

import { useSnackbar } from "@/lib/snackbar";

const ChantEditorJsonDialog = ({ data, onClose, onReset, onUpdate, open }) => {
  const fullScreen = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const textRef = useRef();
  const { snackError, snackInfo } = useSnackbar();
  const [json, setJson] = useState("");

  useEffect(() => setJson(JSON.stringify(data, null, 2)), [data]);

  const onClickCopy = () => {
    const el = textRef.current;
    el.focus();
    el.select();
    el.setSelectionRange(0, 99999); // mobile
    document.execCommand("copy");
    snackInfo("Copied JSON to clipboard");
    onClose?.();
  };

  const onClickReset = () => {
    onReset?.();
    snackInfo("Resetted timing data");
    onClose?.();
  };

  const onClickUpdate = () => {
    let timing;
    try {
      timing = JSON.parse(json);
    } catch {
      snackError("Invalid JSON");
      return;
    }
    onUpdate?.(timing);
    snackInfo("Updated data with JSON");
    onClose?.();
  };

  const onChange = (event) => {
    setJson(event.target.value);
  };

  return (
    <Dialog
      aria-labelledby="chant-editor-json-dialog"
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={open}
    >
      <DialogTitle id="chant-editor-json-dialog">Get / Set JSON</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="JSON"
          multiline
          onChange={onChange}
          inputRef={textRef}
          rows={20}
          value={json}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={onClickCopy}>
          Copy
        </Button>
        <Button color="primary" onClick={onClickUpdate}>
          Update
        </Button>
        <Button color="primary" onClick={onClickReset}>
          Reset
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChantEditorJsonDialog;

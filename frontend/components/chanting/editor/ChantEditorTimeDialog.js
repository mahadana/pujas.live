import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import _isFinite from "lodash/isFinite";
import { memo, useEffect, useRef, useState } from "react";

import { timeToHuman } from "@/lib/chanting";

const useStyles = makeStyles((theme) => ({
  verse: {
    fontFamily: "Gentium Incantation",
  },
}));

const ChantEditorTimeDialog = memo(
  ({ dispatch, index, onClose: parentOnClose, onSaved, state }) => {
    const fullScreen = useMediaQuery((theme) => theme.breakpoints.down("xs"));
    const startInputRef = useRef();
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [saved, setSaved] = useState(false);
    const classes = useStyles();

    const node = state.timing?.nodes?.[index];
    const open = Boolean(node);
    const startInput = startInputRef.current;

    useEffect(() => setStart(timeToHuman(node?.start, 1)), [node]);
    useEffect(() => setEnd(timeToHuman(node?.end, 1)), [node]);
    useEffect(() => {
      if (open) setSaved(false);
    }, [open]);
    useEffect(() => {
      if (open && startInput) setTimeout(() => startInput.select(), 0);
    }, [open, startInput]);

    const onChangeStart = (event) => setStart(event.target.value);
    const onChangeEnd = (event) => setEnd(event.target.value);
    const onClose = () => {
      setSaved(false);
      parentOnClose?.();
    };
    const onExited = () => {
      if (saved) onSaved?.();
    };
    const onSubmit = (event) => {
      event.preventDefault();
      if (_isFinite(index)) {
        dispatch({ type: "UPDATE_NODE", index: index, start, end });
      }
      setSaved(true);
      parentOnClose?.();
    };

    return (
      <Dialog
        aria-labelledby="chant-editor-time-dialog"
        fullScreen={fullScreen}
        fullWidth
        keepMounted
        maxWidth="sm"
        onClose={onClose}
        onExited={onExited}
        open={open}
      >
        <DialogTitle id="chant-editor-time-dialog">
          Edit Time {node?.index ?? ""}
        </DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent>
            <DialogContentText>
              <span
                className={classes.verse}
                dangerouslySetInnerHTML={{ __html: node?.html }}
              />
            </DialogContentText>
            <TextField
              inputRef={startInputRef}
              label="Start"
              name="start"
              onChange={onChangeStart}
              inputProps={{ tabIndex: "1" }}
              value={start}
              variant="outlined"
            />{" "}
            <TextField
              label="End"
              name="end"
              onChange={onChangeEnd}
              inputProps={{ tabIndex: "2" }}
              value={end}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button tabIndex="4" onClick={onClose}>
              Cancel
            </Button>
            <Button color="primary" tabIndex="3" type="submit">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch &&
    prev.index === next.index &&
    prev.onClose === next.onClose &&
    prev.onSaved === next.onSaved &&
    prev.state.timing === next.state.timing
);

ChantEditorTimeDialog.displayName = "ChantEditorTimeDialog";

export default ChantEditorTimeDialog;

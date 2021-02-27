import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useEffect, useState } from "react";

import {
  humanToTime,
  timeToHuman,
} from "@/components/chanting/editor/ChantEditorReducer";

const useStyles = makeStyles((theme) => ({
  verse: {
    fontFamily: "Gentium Incantation",
  },
}));

const ChantEditorTimeDialog = ({ onClose, onSave, open, time }) => {
  const fullScreen = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const classes = useStyles();

  useEffect(() => setStart(timeToHuman(time?.start)), [time]);
  useEffect(() => setEnd(timeToHuman(time?.end)), [time]);

  const onClickSave = () => {
    onSave?.({
      start: humanToTime(start),
      end: humanToTime(end),
    });
    onClose?.();
  };

  const onChangeStart = (event) => setStart(event.target.value);
  const onChangeEnd = (event) => setEnd(event.target.value);

  return (
    <Dialog
      aria-labelledby="chant-editor-time-dialog"
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={open}
    >
      <DialogTitle id="chant-editor-time-dialog">
        Edit Time {time?.index ?? ""}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <span
            className={classes.verse}
            dangerouslySetInnerHTML={{ __html: time?.html }}
          />
        </DialogContentText>
        <TextField
          autoFocus
          label="Start"
          name="start"
          onChange={onChangeStart}
          value={start}
        />{" "}
        <TextField label="End" name="end" onChange={onChangeEnd} value={end} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={onClickSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChantEditorTimeDialog;

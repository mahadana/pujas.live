import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useRef } from "react";

const DEFAULT_URL =
  "https://www.abhayagiri.org/media/chanting/audio/morning.mp3";

const ChantSetMediaDialog = ({ fullScreen, onClose, onSubmit, open }) => {
  const ref = useRef();

  const localOnSubmit = (event) => {
    event.preventDefault();
    let url = ref.current?.elements?.[0]?.value;
    if (!url) url = DEFAULT_URL;
    onSubmit(url);
    onClose();
  };

  return (
    <Dialog
      aria-labelledby="chant-set-media-dialog"
      fullScreen={fullScreen}
      onClose={onClose}
      open={open}
    >
      <form onSubmit={localOnSubmit} ref={ref}>
        <DialogTitle id="chant-set-media-dialog">Set Media URL</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the URL of the MP3 or OGG to play with this chant. Leave blank
            for default URL.
          </DialogContentText>
          <TextField autoFocus fullWidth label="URL" name="url" type="url" />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="primary" type="submit">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChantSetMediaDialog;

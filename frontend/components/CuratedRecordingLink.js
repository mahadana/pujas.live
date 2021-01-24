import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import { useState } from "react";

import CuratedRecording from "@/components/CuratedRecording";
import Link from "@/components/Link";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  closeIcon: {
    color: "#999",
    fontSize: 40,
  },
}));

const CuratedRecordingLink = ({ curatedRecordings }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const onClick = (event) => {
    event.preventDefault();
    setOpen(true);
  };
  const onClose = () => setOpen(false);

  return (
    <>
      <Link href="#" onClick={onClick}>
        Recorded pujas
      </Link>
      <Dialog maxWidth={null} open={open} onClose={onClose} scroll="body">
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CancelIcon className={classes.closeIcon} />
        </IconButton>
        <DialogTitle>Recorded Pujas</DialogTitle>
        <DialogContent dividers={false}>
          {curatedRecordings.map((curatedRecording, index) => (
            <CuratedRecording key={index} {...curatedRecording} />
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CuratedRecordingLink;

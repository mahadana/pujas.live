import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useState } from "react";

import CuratedRecording from "@/components/CuratedRecording";
import Link from "@/components/Link";

const CuratedRecordingLink = ({ curatedRecordings }) => {
  const [open, setOpen] = useState(false);
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
      <Dialog
        maxWidth="auto"
        open={open}
        onClose={onClose}
        scroll="body"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Recorded Pujas</DialogTitle>
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

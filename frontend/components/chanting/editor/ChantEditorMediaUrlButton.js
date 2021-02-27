import Button from "@material-ui/core/Button";
import { useState } from "react";

import ChantSetMediaDialog from "@/components/chanting/inputs/ChantSetMediaDialog";

const ChantEditorMediaUrlButton = ({ children, dispatch, state, ...props }) => {
  const [open, setOpen] = useState(false);

  const onClick = () => setOpen(true);
  const onClose = () => setOpen(false);
  const onSubmit = (mediaUrl) => dispatch({ type: "SET_MEDIA_URL", mediaUrl });

  return (
    <>
      <Button {...props} disabled={!state.timing} onClick={onClick}>
        {children}
      </Button>
      <ChantSetMediaDialog onClose={onClose} onSubmit={onSubmit} open={open} />
    </>
  );
};

export default ChantEditorMediaUrlButton;

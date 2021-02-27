import Button from "@material-ui/core/Button";
import { useState } from "react";

import ChantEditorJsonDialog from "@/components/chanting/editor/ChantEditorJsonDialog";

const ChantEditorJsonButton = ({ children, dispatch, state, ...props }) => {
  const [open, setOpen] = useState(false);

  const onClick = () => setOpen(true);
  const onClose = () => setOpen(false);
  const onUpdate = (importedTiming) =>
    dispatch({ type: "IMPORT_TIMING", importedTiming });

  return (
    <>
      <Button {...props} onClick={onClick}>
        {children}
      </Button>
      <ChantEditorJsonDialog
        data={state.exportedTiming}
        onClose={onClose}
        onUpdate={onUpdate}
        open={open}
      />
    </>
  );
};

export default ChantEditorJsonButton;

import Button from "@material-ui/core/Button";
import { useState } from "react";

import ChantModal from "@/components/chanting/ChantModal";
import PageLayout from "@/components/PageLayout";

const ChanTestPage = () => {
  const [open, setOpen] = useState(true);

  const onClick = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <PageLayout>
      <div style={{ marginTop: "5em", textAlign: "center" }}>
        <Button onClick={onClick} size="large" variant="contained">
          Open Chanting Window
        </Button>
        <ChantModal onClose={onClose} open={open} />
      </div>
    </PageLayout>
  );
};

export default ChanTestPage;

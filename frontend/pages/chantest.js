import { useState } from "react";

import ChantingBookButton from "@/components/ChantingBookButton";
import ChantModal from "@/components/chanting/ChantModal";
import ChantWindow from "@/components/chanting/ChantWindow";
import PageLayout from "@/components/PageLayout";

const ChanTestPage = () => {
  const [open, setOpen] = useState(true);

  const onClick = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <PageLayout>
      <div style={{ fontSize: "7vh", marginTop: "0.5em", textAlign: "center" }}>
        <ChantingBookButton book="1" onClick={onClick} />
        <ChantingBookButton book="2" onClick={onClick} />
        <ChantModal onClose={onClose} open={open}>
          {({ chants, mobile, toc }) => (
            <ChantWindow
              chants={chants}
              mobile={mobile}
              onClose={onClose}
              toc={toc}
            />
          )}
        </ChantModal>
      </div>
    </PageLayout>
  );
};

export default ChanTestPage;

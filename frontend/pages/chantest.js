import Container from "@material-ui/core/Container";
import { useState } from "react";

import ChantingBookButton from "@/components/ChantingBookButton";
import ChantModal from "@/components/chanting/ChantModal";
import ChantWindow from "@/components/chanting/ChantWindow";
import PageHeading from "@/components/PageHeading";
import PageLayout from "@/components/PageLayout";
import Title from "@/components/Title";

import ChantFontStyle from "@/components/chanting/ChantFontStyle";

const ChanTestPage = () => {
  const [open, setOpen] = useState(true);

  const onClick = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <PageLayout>
      <Title title="Chant Test" />
      <ChantFontStyle />
      <Container maxWidth="md">
        <PageHeading>Chant Test</PageHeading>
        <div
          style={{ fontSize: "5vh", marginTop: "0.5em", textAlign: "center" }}
        >
          <ChantModal onClose={onClose} open={open}>
            {({ chantData, mobile }) => (
              <ChantWindow
                chantData={chantData}
                mobile={mobile}
                onClose={onClose}
              />
            )}
          </ChantModal>
          <ChantingBookButton book="1" onClick={onClick} />
          <ChantingBookButton book="2" onClick={onClick} />
        </div>
      </Container>
    </PageLayout>
  );
};

export default ChanTestPage;

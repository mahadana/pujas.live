import Container from "@material-ui/core/Container";
import { useState } from "react";

import ChantFontStyle from "@/components/chanting/ChantFontStyle";
import ChantLoader from "@/components/chanting/ChantLoader";
import ChantModal from "@/components/chanting/ChantModal";
import ChantToc from "@/components/chanting/ChantToc";
import PageHeading from "@/components/PageHeading";
import PageLayout from "@/components/PageLayout";
import Title from "@/components/Title";

const ChantingPage = () => {
  const [chantSet, setChantSet] = useState(null);
  const [open, setOpen] = useState(false);

  const onClose = () => setOpen(false);
  const onOpen = (chantSet) => {
    setChantSet(chantSet);
    setOpen(true);
  };

  return (
    <PageLayout>
      <Title title="Chanting" />
      <Container maxWidth="md">
        <PageHeading>Chanting</PageHeading>
        <ChantFontStyle />
        <ChantLoader>
          {(chantData) => (
            <>
              <ChantModal
                chantData={chantData}
                chantSet={chantSet}
                disableToc
                onClose={onClose}
                open={open}
              />
              <ChantToc onOpen={onOpen} toc={chantData.toc} />
            </>
          )}
        </ChantLoader>
      </Container>
    </PageLayout>
  );
};
export default ChantingPage;

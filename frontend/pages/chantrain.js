import Container from "@material-ui/core/Container";
import _isFinite from "lodash/isFinite";
import { useRouter } from "next/router";

import ChantFontStyle from "@/components/chanting/ChantFontStyle";
import ChantLoader from "@/components/chanting/ChantLoader";
import ChantToc from "@/components/chanting/ChantToc";
import PageHeading from "@/components/PageHeading";
import PageLayout from "@/components/PageLayout";
import Title from "@/components/Title";

const ChanTrainPage = () => {
  const router = useRouter();
  return (
    <PageLayout>
      <Title title="Chant Training" />
      <ChantFontStyle />
      <Container maxWidth="md">
        <PageHeading>Chant Training</PageHeading>
        <ChantLoader>
          {({ toc }) => {
            const onOpen = ({ chantIndex, link: chantId }) => {
              if (_isFinite(chantIndex)) router.push(`/chantrain/${chantId}`);
            };
            return <ChantToc onOpen={onOpen} raw={true} toc={toc} />;
          }}
        </ChantLoader>
      </Container>
    </PageLayout>
  );
};

export default ChanTrainPage;

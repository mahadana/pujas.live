import Container from "@material-ui/core/Container";
import { useRouter } from "next/router";

import ChantFontStyle from "@/components/chanting/ChantFontStyle";
import ChantLoader from "@/components/chanting/ChantLoader";
import ChantEditor from "@/components/chanting/editor/ChantEditor";
import PageHeading from "@/components/PageHeading";
import PageLayout from "@/components/PageLayout";
import Title from "@/components/Title";

const ChanTrainEditPage = () => {
  const router = useRouter();
  return (
    <PageLayout>
      <Title title="Chant Training" />
      <ChantFontStyle />
      <Container maxWidth="md">
        <PageHeading>Chant Training</PageHeading>
        <ChantLoader>
          {({ chantData: { chantMap } }) => {
            const chantId = router.query.id;
            const chant = chantMap[chantId];
            if (chant) {
              return <ChantEditor chant={chant} />;
            }
          }}
        </ChantLoader>
      </Container>
    </PageLayout>
  );
};

export default ChanTrainEditPage;

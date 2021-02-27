import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import _isFinite from "lodash/isFinite";
import { useRouter } from "next/router";

import ChantFontStyle from "@/components/chanting/ChantFontStyle";
import ChantLoader from "@/components/chanting/ChantLoader";
import ChantToc from "@/components/chanting/ChantToc";
import PageLayout from "@/components/PageLayout";
import Title from "@/components/Title";

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "Gentium Incantation",
  },
}));

const ChanTrainPage = () => {
  const router = useRouter();
  const classes = useStyles();

  return (
    <PageLayout>
      <Title title="Chant Training" />
      <ChantFontStyle />
      <Container maxWidth="md">
        <div className={classes.root}>
          <h1>Chant Training</h1>
          <ChantLoader>
            {({ toc }) => {
              const onOpen = ({ chantIndex, link: chantId }) => {
                if (_isFinite(chantIndex)) router.push(`/chantrain/${chantId}`);
              };
              return <ChantToc onOpen={onOpen} raw={true} toc={toc} />;
            }}
          </ChantLoader>
        </div>
      </Container>
    </PageLayout>
  );
};

export default ChanTrainPage;

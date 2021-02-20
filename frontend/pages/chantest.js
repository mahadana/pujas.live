import useMediaQuery from "@material-ui/core/useMediaQuery";
import Head from "next/head";
import { useEffect, useState } from "react";

import ChantingWindow from "@/components/chanting/ChantingWindow";
import PageLayout from "@/components/PageLayout";

const fetchData = async () => {
  // Remote site needs header "Access-Control-Allow-Origin *"" if serving
  // from another domain;
  const [rawChants, toc] = await Promise.all(
    (
      await Promise.all([
        fetch(
          "https://vjagaro.github.io/community-chanting-book/dist/chanting.json"
        ),
        fetch(
          "https://vjagaro.github.io/community-chanting-book/dist/toc.json"
        ),
      ])
    ).map((response) => response.json())
  );

  const chants = {
    chantMap: rawChants.reduce((map, chant) => {
      map[chant.id] = chant;
      return map;
    }, {}),
    chants: rawChants,
  };

  return { chants, toc };
};

const ChanTestPage = () => {
  const mobile = !useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!data) {
      fetchData()
        .then((data) => setData(data))
        .catch(console.error);
    }
  }, [data]);

  return (
    <>
      <Head>
        <link href="/fonts/style.css" rel="stylesheet" />
      </Head>
      <PageLayout queryResult={{ data, loading: !data }}>
        {({ data: { chants, toc } }) => (
          <ChantingWindow chants={chants} mobile={mobile} toc={toc} />
        )}
      </PageLayout>
    </>
  );
};

export default ChanTestPage;

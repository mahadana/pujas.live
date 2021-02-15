import { useIdleTimer } from "react-idle-timer";
import { useEffect, useState } from "react";

import HomeContent from "@/components/HomeContent";
import PageLayout from "@/components/PageLayout";
import { apolloClient } from "@/lib/apollo";
import { HOME_QUERY } from "@/lib/schema";

const fetchHomeResult = async () =>
  await apolloClient.query({
    fetchPolicy: "network-only",
    query: HOME_QUERY,
  });

const HomePage = ({ staticResult }) => {
  const [queryResult, setQueryResult] = useState(null);

  const updateQueryResult = () => {
    if (queryResult?.loading) {
      return;
    }

    setQueryResult({
      called: true,
      data: queryResult?.data || staticResult?.data,
      error: false,
      loading: true,
      previousData: queryResult?.previousData,
    });

    (async () => {
      let newResult;
      try {
        newResult = await fetchHomeResult();
      } catch (error) {
        newResult = {
          called: true,
          data: queryResult?.data || staticResult?.data,
          error,
          loading: false,
          refetch: updateQueryResult,
        };
      }
      setQueryResult(newResult);
    })().catch(console.error);
  };

  useEffect(updateQueryResult, []);

  const { reset: resetIdleTimer } = useIdleTimer({
    debounce: 500,
    onIdle: () => {
      if (!queryResult?.error) {
        updateQueryResult();
      }
      resetIdleTimer();
    },
    timeout: 1000 * 10,
  });

  return (
    <PageLayout chantingBooks queryResult={queryResult || staticResult}>
      {({ data }) => (
        <HomeContent channels={data.channels} groups={data.groups} />
      )}
    </PageLayout>
  );
};

export const getStaticProps = async () => {
  let staticResult;
  try {
    staticResult = await fetchHomeResult();
  } catch {
    staticResult = {
      called: true,
      data: null,
      error: false,
      loading: true,
    };
  }
  return {
    props: { staticResult },
    revalidate: 10,
  };
};

export default HomePage;

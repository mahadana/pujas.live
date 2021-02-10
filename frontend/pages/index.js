import { useQuery } from "@apollo/client";
import { useIdleTimer } from "react-idle-timer";

import HomeContent from "@/components/HomeContent";
import PageLayout from "@/components/PageLayout";
import { withApollo } from "@/lib/apollo";
import { HOME_QUERY } from "@/lib/schema";

const HomePage = () => {
  const queryResult = useQuery(HOME_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const { reset: resetIdleTimer } = useIdleTimer({
    debounce: 500,
    onIdle: () => {
      if (!queryResult.error) {
        queryResult.refetch();
      }
      resetIdleTimer();
    },
    timeout: 1000 * 10,
  });

  return (
    <PageLayout chantingBooks queryResult={queryResult}>
      {({ data }) => (
        <HomeContent channels={data.channels} groups={data.groups} />
      )}
    </PageLayout>
  );
};

export default withApollo({ ssr: true })(HomePage);

import { useQuery } from "@apollo/client";

import Banner from "@/components/Banner";
import ChantingBooksBar from "@/components/ChantingBooksBar";
import HomeContent from "@/components/HomeContent";
import Loading from "@/components/Loading";
import { withApollo } from "@/lib/apollo";
import { HOME_QUERY } from "@/lib/schema";

const HomePage = () => {
  const result = useQuery(HOME_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  return (
    <>
      <Banner />
      <ChantingBooksBar />
      <Loading {...result}>
        {({ data }) => (
          <HomeContent channels={data.channels} groups={data.groups} />
        )}
      </Loading>
    </>
  );
};

export default withApollo()(HomePage);

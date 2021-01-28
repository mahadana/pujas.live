import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

import Banner from "@/components/Banner";
import ChannelRecordingsContent from "@/components/ChannelRecordingsContent";
import ChantingBooksBar from "@/components/ChantingBooksBar";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { withApollo } from "@/lib/apollo";
import { CHANNEL_QUERY } from "@/lib/schema";

const ChannelRecordingsPage = () => {
  const router = useRouter();
  const result = useQuery(CHANNEL_QUERY, {
    fetchPolicy: "cache-and-network",
    skip: !router.query.id,
    variables: { id: router.query.id },
  });

  return (
    <>
      <Title title="Recordings" />
      <Banner />
      <ChantingBooksBar />
      <Loading {...result}>
        {({ data: { channel } }) => (
          <ChannelRecordingsContent channel={channel} />
        )}
      </Loading>
    </>
  );
};

export default withApollo()(ChannelRecordingsPage);

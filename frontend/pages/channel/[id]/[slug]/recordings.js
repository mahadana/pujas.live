import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

import ChannelRecordingsContent from "@/components/ChannelRecordingsContent";
import PageLayout from "@/components/PageLayout";
import { withApollo } from "@/lib/apollo";
import { CHANNEL_QUERY } from "@/lib/schema";

const ChannelRecordingsPage = () => {
  const router = useRouter();
  const queryResult = useQuery(CHANNEL_QUERY, {
    fetchPolicy: "cache-and-network",
    skip: !router.isReady,
    variables: { id: router.query.id },
  });

  return (
    <PageLayout chantingBooks queryResult={queryResult} title="Recordings">
      {({ data }) => <ChannelRecordingsContent channel={data.channel} />}
    </PageLayout>
  );
};

export default withApollo()(ChannelRecordingsPage);

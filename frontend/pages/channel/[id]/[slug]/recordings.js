import { useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";

import ChannelRecordingsContent from "@/components/ChannelRecordingsContent";
import PageLayout from "@/components/PageLayout";
import { withApollo } from "@/lib/apollo";
import { CHANNEL_QUERY } from "@/lib/schema";
import { useEffect } from "react";

const ChannelRecordingsPage = () => {
  const router = useRouter();
  const [startQuery, queryResult] = useLazyQuery(CHANNEL_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (router.isReady) {
      startQuery({
        variables: { id: router.query.id, time: new Date().toISOString() },
      });
    }
  }, [router.isReady]);

  return (
    <PageLayout queryResult={queryResult} title="Recordings">
      {({ data }) => <ChannelRecordingsContent channel={data.channel} />}
    </PageLayout>
  );
};

export default withApollo()(ChannelRecordingsPage);

import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

import PageLayout from "@/components/PageLayout";
import RecordingContent from "@/components/RecordingContent";
import { withApollo } from "@/lib/apollo";
import { RECORDING_QUERY } from "@/lib/schema";

const RecordingPage = () => {
  const router = useRouter();
  const queryResult = useQuery(RECORDING_QUERY, {
    skip: !router.isReady,
    variables: { id: router.query.id },
  });

  return (
    <PageLayout banner={false} queryResult={queryResult} title="Recording">
      {({ data }) => <RecordingContent recording={data.recording} />}
    </PageLayout>
  );
};

export default withApollo()(RecordingPage);

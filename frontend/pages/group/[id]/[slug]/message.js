import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

import GroupMessageContent from "@/components/GroupMessageContent";
import PageLayout from "@/components/PageLayout";
import { withApollo } from "@/lib/apollo";
import { GROUP_QUERY } from "@/lib/schema";

const GroupMessagePage = () => {
  const router = useRouter();
  const queryResult = useQuery(GROUP_QUERY, {
    fetchPolicy: "cache-and-network",
    skip: !router.isReady,
    variables: { id: router.query.id },
  });

  return (
    <PageLayout queryResult={queryResult} title="Join Group">
      {({ data }) => <GroupMessageContent group={data.group} />}
    </PageLayout>
  );
};

export default withApollo()(GroupMessagePage);

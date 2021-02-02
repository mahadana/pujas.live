import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

import GroupEditContent from "@/components/GroupEditContent";
import PageLayout from "@/components/PageLayout";
import { withApollo } from "@/lib/apollo";
import { GROUP_QUERY } from "@/lib/schema";

const GroupEditPage = () => {
  const router = useRouter();
  const queryResult = useQuery(GROUP_QUERY, {
    fetchPolicy: "network-only",
    skip: !router.isReady,
    variables: { id: router.query.id },
  });

  return (
    <PageLayout requireUser queryResult={queryResult} title="Edit Group">
      {({ data }) => <GroupEditContent group={data.group} />}
    </PageLayout>
  );
};

export default withApollo()(GroupEditPage);

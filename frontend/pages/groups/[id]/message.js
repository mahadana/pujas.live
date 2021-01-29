import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

import Banner from "@/components/Banner";
import GroupMessageContent from "@/components/GroupMessageContent";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { withApollo } from "@/lib/apollo";
import { GROUP_QUERY } from "@/lib/schema";

const GroupMessagePage = () => {
  const router = useRouter();

  const groupId = router.query.id;
  const result = useQuery(GROUP_QUERY, {
    fetchPolicy: "cache-and-network",
    skip: !groupId,
    variables: { id: groupId },
  });

  return (
    <>
      <Title title="Join Group" />
      <Banner />
      <Loading {...result}>
        {({ data: { group } }) => <GroupMessageContent group={group} />}
      </Loading>
    </>
  );
};

export default withApollo()(GroupMessagePage);

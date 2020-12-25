import { useQuery } from "@apollo/client";
import Container from "@material-ui/core/Container";
import { useRouter } from "next/router";
import { useState } from "react";

import Banner from "../../../components/Banner";
import GroupMessageForm from "../../../components/GroupMessageForm";
import Loading from "../../../components/Loading";
import NotLoggedIn from "../../../components/NotLoggedIn";
import UserBar from "../../../components/UserBar";
import { withApolloAndUser } from "../../../lib/apollo";
import { GROUP_QUERY } from "../../../lib/schema";
import { useUser } from "../../../lib/user";

const GroupMessagePage = () => {
  const router = useRouter();
  const { user, userLoading } = useUser();
  const [complete, setComplete] = useState(false);

  const groupId = router.query.id;
  const { loading, data } = useQuery(GROUP_QUERY, {
    skip: !groupId,
    variables: { id: groupId },
  });
  const group = data?.group;

  const onSubmit = async (values) => {
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    await sleep(2000);
    setComplete(true);
  };

  return (
    <>
      <Banner />
      <UserBar />
      <Container maxWidth="sm">
        {loading || userLoading || !group ? (
          <Loading />
        ) : !user ? (
          <NotLoggedIn />
        ) : !complete ? (
          <GroupMessageForm
            disabled={complete}
            group={group}
            onSubmit={onSubmit}
          />
        ) : (
          <p>Your message has been sent TODO</p>
        )}
      </Container>
    </>
  );
};

export default withApolloAndUser()(GroupMessagePage);

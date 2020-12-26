import { useQuery } from "@apollo/client";
import Container from "@material-ui/core/Container";
import { useRouter } from "next/router";
import { useState } from "react";

import Banner from "../../../components/Banner";
import GroupMessageForm from "../../../components/GroupMessageForm";
import GroupMessageSuccess from "../../../components/GroupMessageSuccess";
import Loading from "../../../components/Loading";
import NotLoggedIn from "../../../components/NotLoggedIn";
import UserBar from "../../../components/UserBar";
import { apolloClient, withApollo } from "../../../lib/apollo";
import { GROUP_QUERY, MESSAGE_GROUP_MUTATION } from "../../../lib/schema";
import { useSnackbar } from "../../../lib/snackbar";
import { useUser } from "../../../lib/user";
import { translateStrapiError } from "../../../lib/util";

const GroupMessagePage = () => {
  const router = useRouter();
  const { snackError, snackSuccess } = useSnackbar();
  const { user, userLoading } = useUser();
  const [complete, setComplete] = useState(false);

  const groupId = router.query.id;
  const { loading, data } = useQuery(GROUP_QUERY, {
    fetchPolicy: "cache-and-network",
    skip: !groupId,
    variables: { id: groupId },
  });
  const group = data?.group;

  const onSubmit = async (values, form) => {
    const variables = {
      input: {
        where: { id: groupId },
        data: {
          name: values.name,
          email: values.email,
          message: values.message,
        },
      },
    };
    try {
      const result = await apolloClient.mutate({
        mutation: MESSAGE_GROUP_MUTATION,
        variables,
      });
      snackSuccess("Successfully sent the message.");
      setComplete(true);
    } catch (error) {
      snackError(translateStrapiError(error));
      console.error(error);
    }
  };

  return (
    <>
      <Banner />
      <UserBar />
      <Container maxWidth="sm">
        {(!user && userLoading) || loading || !group ? (
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
          <GroupMessageSuccess />
        )}
      </Container>
    </>
  );
};

export default withApollo()(GroupMessagePage);

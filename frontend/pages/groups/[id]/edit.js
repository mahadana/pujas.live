import { useQuery } from "@apollo/client";
import Container from "@material-ui/core/Container";
import { useRouter } from "next/router";
import { useState } from "react";

import Banner from "../../../components/Banner";
import GroupForm from "../../../components/GroupForm";
import Loading from "../../../components/Loading";
import NotLoggedIn from "../../../components/NotLoggedIn";
import UserBar from "../../../components/UserBar";
import { apolloClient, withApolloAndUser } from "../../../lib/apollo";
import { GROUP_QUERY, UPDATE_GROUP_MUTATION } from "../../../lib/schema";
import { useSnackbar } from "../../../lib/snackbar";
import { useUser } from "../../../lib/user";
import { translateStrapiError } from "../../../lib/util";
import { groupSchema, groupUpdateDbCast } from "../../../lib/validation";

const GroupEditPage = () => {
  const router = useRouter();
  const { snackError, snackSuccess } = useSnackbar();
  const { user, userLoading } = useUser();
  const [group, setGroup] = useState(null);
  const groupId = parseInt(router.query?.id);

  const { loading } = useQuery(GROUP_QUERY, {
    skip: !groupId,
    variables: { id: groupId },
    onCompleted: (data) => {
      setGroup(groupSchema.cast(data.group));
    },
  });

  const onSubmit = async (values, form) => {
    const data = groupUpdateDbCast.cast(values);
    const variables = { input: { where: { id: groupId }, data } };
    try {
      const result = await apolloClient.mutate({
        mutation: UPDATE_GROUP_MUTATION,
        variables,
      });
      const newGroup = result.data.updateGroup.group;
      setGroup(groupSchema.cast(newGroup));
      snackSuccess("Successfully updated group");
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
        {loading || userLoading || !group ? (
          <Loading />
        ) : !user ? (
          <NotLoggedIn />
        ) : (
          <GroupForm group={group} onSubmit={onSubmit} />
        )}
      </Container>
    </>
  );
};

export default withApolloAndUser()(GroupEditPage);

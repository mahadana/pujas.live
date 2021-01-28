import { useQuery } from "@apollo/client";
import Container from "@material-ui/core/Container";
import { useRouter } from "next/router";

import Banner from "@/components/Banner";
import GroupForm from "@/components/GroupForm";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { apolloClient, withApollo } from "@/lib/apollo";
import { GROUP_QUERY, UPDATE_GROUP_MUTATION } from "@/lib/schema";
import { useSnackbar } from "@/lib/snackbar";
import { translateStrapiError } from "@/lib/util";
import { groupSchema, groupUpdateDbCast } from "@/lib/validation";

const GroupEditPage = () => {
  const router = useRouter();
  const { snackError, snackSuccess } = useSnackbar();

  const groupId = router.query.id;
  const result = useQuery(GROUP_QUERY, {
    fetchPolicy: "network-only",
    skip: !groupId,
    variables: { id: groupId },
  });

  const onSubmit = async (values) => {
    const data = groupUpdateDbCast.cast(values);
    const variables = { input: { where: { id: groupId }, data } };
    try {
      await apolloClient.mutate({
        mutation: UPDATE_GROUP_MUTATION,
        variables,
      });
      snackSuccess("Successfully updated group");
    } catch (error) {
      snackError(translateStrapiError(error));
      console.error(error);
    }
  };

  return (
    <>
      <Title title="Edit Group" />
      <Banner />
      <Loading requireUser {...result}>
        {({ data: { group } }) => {
          group = groupSchema.cast(group);
          return (
            <Container maxWidth="sm">
              <Title title={`Edit ${group.title}`} />
              <GroupForm group={group} onSubmit={onSubmit} />
            </Container>
          );
        }}
      </Loading>
    </>
  );
};

export default withApollo()(GroupEditPage);

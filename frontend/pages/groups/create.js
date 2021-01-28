import Container from "@material-ui/core/Container";
import { useRouter } from "next/router";

import Banner from "@/components/Banner";
import GroupForm from "@/components/GroupForm";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { apolloClient, withApollo } from "@/lib/apollo";
import { CREATE_GROUP_MUTATION } from "@/lib/schema";
import { useSnackbar } from "@/lib/snackbar";
import { dayjs } from "@/lib/time";
import { useUser } from "@/lib/user";
import { translateStrapiError } from "@/lib/util";
import { groupSchema, groupCreateDbCast } from "@/lib/validation";

const GroupCreatePage = () => {
  const router = useRouter();
  const { snackError, snackSuccess } = useSnackbar();
  const { user } = useUser();

  const onSubmit = async (values) => {
    const data = groupCreateDbCast.cast(values);
    data.listed = true;
    data.owner = user.id;
    const variables = { input: { data } };
    try {
      const result = await apolloClient.mutate({
        mutation: CREATE_GROUP_MUTATION,
        variables,
      });
      const newGroup = result.data.createGroup.group;
      snackSuccess("Successfully created group");
      router.push(`/groups/${newGroup.id}/edit`, null, {
        scroll: false,
        shallow: true,
      });
    } catch (error) {
      snackError(translateStrapiError(error));
      console.error(error);
    }
  };

  const newGroup = groupSchema.cast();
  newGroup.timezone = dayjs.tz.guess();

  return (
    <>
      <Title title="New Group" />
      <Banner />
      <Loading
        data
        requireUser
        noUserMessage="Please create an account to post a new group. It's easy!"
      >
        {() => (
          <Container maxWidth="sm">
            <GroupForm group={newGroup} onSubmit={onSubmit} />
          </Container>
        )}
      </Loading>
    </>
  );
};

export default withApollo()(GroupCreatePage);

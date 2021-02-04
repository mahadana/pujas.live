import { useMutation } from "@apollo/client";
import Container from "@material-ui/core/Container";

import GroupForm from "@/components/GroupForm";
import Title from "@/components/Title";
import { UPDATE_GROUP_MUTATION } from "@/lib/schema";
import { useSnackbar } from "@/lib/snackbar";
import { groupSchema, groupUpdateDbCast } from "@/lib/validation";

const GroupEditContent = ({ group }) => {
  const [updateGroup] = useMutation(UPDATE_GROUP_MUTATION);
  const { snackException, snackSuccess } = useSnackbar();

  const groupId = group.id;
  group = groupSchema.cast(group);

  const onSubmit = async (values) => {
    const data = groupUpdateDbCast.cast(values);
    try {
      await updateGroup({
        variables: { input: { where: { id: groupId }, data } },
      });
      snackSuccess("Successfully updated group");
    } catch (error) {
      snackException(error);
    }
  };

  return (
    <Container maxWidth="sm">
      {!!group.title && <Title title={group.title} />}
      <GroupForm group={group} onSubmit={onSubmit} />
    </Container>
  );
};

export default GroupEditContent;

import { useMutation } from "@apollo/client";
import Container from "@material-ui/core/Container";
import { useRouter } from "next/router";

import GroupForm from "@/components/GroupForm";
import { getGroupEditPath } from "@/lib/path";
import { CREATE_GROUP_MUTATION } from "@/lib/schema";
import { useSnackbar } from "@/lib/snackbar";
import { dayjs } from "@/lib/time";
import { useUser } from "@/lib/user";
import { groupSchema, groupCreateDbCast } from "@/lib/validation";

const GroupCreateContent = () => {
  const [createGroup] = useMutation(CREATE_GROUP_MUTATION);
  const router = useRouter();
  const { snackException, snackSuccess } = useSnackbar();
  const { user } = useUser();

  const onSubmit = (values, formik) => {
    (async () => {
      try {
        const data = groupCreateDbCast.cast(values);
        const result = await createGroup({
          variables: {
            input: { data: { ...data, listed: true, owner: user.id } },
          },
        });
        const group = result.data.createGroup.group;
        snackSuccess("Successfully created group");
        router.push(getGroupEditPath(group), null, {
          scroll: false,
          shallow: true,
        });
      } catch (error) {
        snackException(error);
        formik.setSubmitting(false);
      }
    })();
  };

  const group = groupSchema.cast();
  group.timezone = dayjs.tz.guess();

  return (
    <Container maxWidth="sm">
      <GroupForm group={group} onSubmit={onSubmit} />
    </Container>
  );
};

export default GroupCreateContent;

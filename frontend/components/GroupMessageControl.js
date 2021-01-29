import { useMutation } from "@apollo/client";

import GroupMessageForm from "@/components/GroupMessageForm";
import { MESSAGE_GROUP_MUTATION } from "@/lib/schema";
import { useSnackbar } from "@/lib/snackbar";

const GroupMessageControl = ({ group, onSuccess }) => {
  const [messageGroup] = useMutation(MESSAGE_GROUP_MUTATION);
  const { snackException } = useSnackbar();

  const onSubmit = async (values, formik, token) => {
    try {
      await messageGroup({
        context: {
          headers: {
            "X-Captcha-Token": token,
          },
        },
        variables: {
          input: {
            where: { id: group.id },
            data: values,
          },
        },
      });
      onSuccess();
    } catch (error) {
      snackException(error);
    }
  };

  return <GroupMessageForm group={group} onSubmit={onSubmit} />;
};

export default GroupMessageControl;

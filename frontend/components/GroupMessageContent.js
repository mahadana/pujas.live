import { useMutation } from "@apollo/client";
import Container from "@material-ui/core/Container";
import { useState } from "react";

import Title from "@/components/Title";
import GroupMessageForm from "@/components/GroupMessageForm";
import GroupMessageSuccess from "@/components/GroupMessageSuccess";
import { MESSAGE_GROUP_MUTATION } from "@/lib/schema";
import { useSnackbar } from "@/lib/snackbar";

const GroupMessageContent = ({ group }) => {
  const [messageGroup] = useMutation(MESSAGE_GROUP_MUTATION);
  const { snackException } = useSnackbar();
  const [success, setSuccess] = useState(false);

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
      setSuccess(true);
    } catch (error) {
      snackException(error);
    }
  };

  return (
    <Container maxWidth="sm">
      {!!group.title && <Title title={group.title} />}
      {!success ? (
        <GroupMessageForm group={group} onSubmit={onSubmit} />
      ) : (
        <GroupMessageSuccess />
      )}
    </Container>
  );
};

export default GroupMessageContent;

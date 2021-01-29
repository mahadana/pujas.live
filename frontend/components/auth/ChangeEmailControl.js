import { useMutation } from "@apollo/client";
import ChangeEmailForm from "@/components/auth/ChangeEmailForm";
import { CHANGE_EMAIL_MUTATION } from "@/lib/schema";
import { useSnackbar } from "@/lib/snackbar";
import { useUser } from "@/lib/user";

const ChangeEmailControl = () => {
  const [changeEmail] = useMutation(CHANGE_EMAIL_MUTATION);
  const { snackSuccess, snackException } = useSnackbar();
  const { setUser, user } = useUser();

  const onSubmit = async (values, formik) => {
    try {
      await changeEmail({ variables: values });
      snackSuccess("Successfully changed email");
      setUser({ ...user, email: values.email });
      formik.resetForm();
    } catch (error) {
      snackException(error);
    }
  };

  return <ChangeEmailForm onSubmit={onSubmit} />;
};

export default ChangeEmailControl;

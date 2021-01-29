import { useMutation } from "@apollo/client";
import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import { CHANGE_PASSWORD_MUTATION } from "@/lib/schema";
import { useSnackbar } from "@/lib/snackbar";

const ChangePasswordControl = () => {
  const [changePassword] = useMutation(CHANGE_PASSWORD_MUTATION);
  const { snackSuccess, snackException } = useSnackbar();

  const onSubmit = async (values, formik) => {
    try {
      await changePassword({ variables: values });
      snackSuccess("Successfully changed password");
      formik.resetForm();
    } catch (error) {
      snackException(error);
    }
  };

  return <ChangePasswordForm onSubmit={onSubmit} />;
};

export default ChangePasswordControl;

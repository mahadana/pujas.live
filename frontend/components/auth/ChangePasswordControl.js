import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import { apolloClient } from "@/lib/apollo";
import { CHANGE_PASSWORD_MUTATION } from "@/lib/schema";
import { useSnackbar } from "@/lib/snackbar";
import { getStrapiError, translateStrapiError } from "@/lib/util";

const ChangePasswordControl = () => {
  const { snackInfo, snackError } = useSnackbar();

  const onSubmit = async (values, formik) => {
    const variables = {
      ...values,
      newPasswordConfirmation: values.newPassword,
    };

    try {
      await apolloClient.mutate({
        mutation: CHANGE_PASSWORD_MUTATION,
        variables,
      });
      snackInfo("Successfully changed password.");
      formik.resetForm();
    } catch (error) {
      const strapiError = getStrapiError(error);
      if (strapiError?.id === "Auth.form.error.invalid") {
        snackError("Incorrect old password");
      } else {
        snackError(translateStrapiError(error));
      }
    }
  };

  return <ChangePasswordForm onSubmit={onSubmit} />;
};

export default ChangePasswordControl;

import ChangeEmailForm from "@/components/auth/ChangeEmailForm";
import { apolloClient } from "@/lib/apollo";
import { CHANGE_EMAIL_MUTATION } from "@/lib/schema";
import { useSnackbar } from "@/lib/snackbar";
import { useUser } from "@/lib/user";
import { translateStrapiError } from "@/lib/util";

const ChangeEmailControl = () => {
  const { snackInfo, snackError } = useSnackbar();
  const { setUser, user } = useUser();

  const onSubmit = async (values) => {
    try {
      await apolloClient.mutate({
        mutation: CHANGE_EMAIL_MUTATION,
        variables: values,
      });
      setUser({ ...user, email: values.email });
      snackInfo("Successfully changed email.");
    } catch (error) {
      snackError(translateStrapiError(error));
    }
  };

  const initialValues = { email: user.email };

  return <ChangeEmailForm initialValues={initialValues} onSubmit={onSubmit} />;
};

export default ChangeEmailControl;

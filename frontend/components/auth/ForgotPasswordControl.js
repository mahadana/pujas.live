import { useState } from "react";

import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import ForgotPasswordSuccess from "@/components/auth/ForgotPasswordSuccess";
import { apolloClient } from "@/lib/apollo";
import { FORGOT_PASSWORD_MUTATION } from "@/lib/schema";
import { useSnackbar } from "@/lib/snackbar";
import { useUser } from "@/lib/user";
import { getStrapiError, sleep, translateStrapiError } from "@/lib/util";

const ForgotPasswordControl = () => {
  const { snackError } = useSnackbar();
  const [completeEmail, setCompleteEmail] = useState(null);
  const { logout } = useUser();

  const onSubmit = async ({ email }, formik, token) => {
    logout();
    try {
      await apolloClient.mutate({
        context: token
          ? {
              headers: {
                "X-Captcha-Token": token,
              },
            }
          : undefined,
        mutation: FORGOT_PASSWORD_MUTATION,
        variables: { email },
      });
      setCompleteEmail(email);
    } catch (error) {
      const strapiError = getStrapiError(error);
      if (strapiError?.id === "Auth.form.error.email.format") {
        formik.setFieldError("email", "Invalid email address");
        formik.validateForm();
      } else if (strapiError?.id === "Auth.form.error.user.not-exist") {
        await sleep(1000);
        setCompleteEmail(email);
        console.warn("Email does not exist: ", email);
      } else {
        snackError(translateStrapiError(error));
        console.error(error);
      }
    }
  };

  if (completeEmail) {
    return <ForgotPasswordSuccess email={completeEmail} />;
  } else {
    return <ForgotPasswordForm onSubmit={onSubmit} />;
  }
};

export default ForgotPasswordControl;

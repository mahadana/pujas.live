import Container from "@material-ui/core/Container";
import { useMutation } from "@apollo/client";
import { useState } from "react";

import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import ForgotPasswordSuccess from "@/components/auth/ForgotPasswordSuccess";
import { FORGOT_PASSWORD_MUTATION } from "@/lib/schema";
import { useSnackbar } from "@/lib/snackbar";
import { useUser } from "@/lib/user";
import { getStrapiError, sleep } from "@/lib/util";

const ForgotPasswordContent = () => {
  const [forgotPassword] = useMutation(FORGOT_PASSWORD_MUTATION);
  const { snackException } = useSnackbar();
  const [completeEmail, setCompleteEmail] = useState(null);
  const { logout } = useUser();

  const onSubmit = async ({ email }, formik, token) => {
    try {
      logout();
      await forgotPassword({
        context: token
          ? {
              headers: {
                "X-Captcha-Token": token,
              },
            }
          : undefined,
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
        snackException(error);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      {!completeEmail ? (
        <ForgotPasswordForm onSubmit={onSubmit} />
      ) : (
        <ForgotPasswordSuccess email={completeEmail} />
      )}
    </Container>
  );
};

export default ForgotPasswordContent;

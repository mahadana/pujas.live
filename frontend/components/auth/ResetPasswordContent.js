import Container from "@material-ui/core/Container";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useState } from "react";

import ResetPasswordCodeExpired from "@/components/auth/ResetPasswordCodeExpired";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import plausible from "@/lib/plausible";
import { RESET_PASSWORD_MUTATION } from "@/lib/schema";
import { useSnackbar } from "@/lib/snackbar";
import { useUser } from "@/lib/user";
import { getStrapiError, useRouteBack } from "@/lib/util";

const ResetPasswordContent = () => {
  const [resetPassword] = useMutation(RESET_PASSWORD_MUTATION);
  const router = useRouter();
  const routeBack = useRouteBack(router);
  const { snackException, snackSuccess } = useSnackbar();
  const [expired, setExpired] = useState(false);
  const { login, logout } = useUser();

  const onSubmit = (values, formik) => {
    (async () => {
      try {
        logout();
        const result = await resetPassword({
          variables: {
            password: values.password,
            passwordConfirmation: values.password,
            code: router.query.code,
          },
        });

        const { jwt, user } = result.data.resetPassword;
        login(user, jwt);
        snackSuccess(`Successfully reset password`);
        plausible("resetPassword");
        routeBack.push();
      } catch (error) {
        const strapiError = getStrapiError(error);
        if (strapiError?.id === "Auth.form.error.code.provide") {
          setExpired(true);
        } else {
          snackException(error);
        }
        formik.setSubmitting(false);
      }
    })();
  };

  return (
    <Container maxWidth="sm">
      {!expired ? (
        <ResetPasswordForm onSubmit={onSubmit} />
      ) : (
        <ResetPasswordCodeExpired />
      )}
    </Container>
  );
};

export default ResetPasswordContent;

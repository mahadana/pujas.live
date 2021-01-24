import { useRouter } from "next/router";
import { useState } from "react";

import ResetPasswordCodeExpired from "@/components/auth/ResetPasswordCodeExpired";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { apolloClient } from "@/lib/apollo";
import { RESET_PASSWORD_MUTATION } from "@/lib/schema";
import { useSnackbar } from "@/lib/snackbar";
import { useUser } from "@/lib/user";
import { pushBack, getStrapiError, translateStrapiError } from "@/lib/util";

const ResetPasswordControl = () => {
  const router = useRouter();
  const { snackInfo, snackError } = useSnackbar();
  const [complete, setComplete] = useState(false);
  const [expired, setExpired] = useState(false);
  const { login, logout } = useUser();

  const onSubmit = async (values) => {
    logout();
    const variables = {
      password: values.password,
      passwordConfirmation: values.password,
      code: router.query.code,
    };

    let user, jwt;
    try {
      const result = await apolloClient.mutate({
        mutation: RESET_PASSWORD_MUTATION,
        variables,
      });
      ({ jwt, user } = result.data.resetPassword);
    } catch (error) {
      const strapiError = getStrapiError(error);
      if (strapiError?.id === "Auth.form.error.code.provide") {
        setExpired(true);
      } else {
        snackError(translateStrapiError(error));
        console.error(error);
      }
      return;
    }

    login(user, jwt);
    setComplete(true);
    snackInfo(`Successfully reset password for ${user.email}`);
    pushBack(router);
  };

  if (expired) {
    return <ResetPasswordCodeExpired />;
  } else {
    return <ResetPasswordForm disabled={complete} onSubmit={onSubmit} />;
  }
};

export default ResetPasswordControl;

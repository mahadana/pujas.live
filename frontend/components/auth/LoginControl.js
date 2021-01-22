import { useRouter } from "next/router";
import { useState } from "react";

import LoginForm from "@/components/auth/LoginForm";
import { apolloClient } from "@/lib/apollo";
import plausible from "@/lib/plausible";
import { LOGIN_MUTATION } from "@/lib/schema";
import { useSnackbar } from "@/lib/snackbar";
import { useUser } from "@/lib/user";
import { pushBack, getStrapiError, translateStrapiError } from "@/lib/util";

const LoginControl = () => {
  const router = useRouter();
  const { snackError, snackInfo } = useSnackbar();
  const [complete, setComplete] = useState(false);
  const { login, logout } = useUser();

  const onSubmit = async (values, formik) => {
    const variables = {
      input: {
        identifier: values.email,
        password: values.password,
      },
    };
    logout();

    let user, jwt;
    try {
      const result = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables,
      });
      ({ user, jwt } = result.data.login);
    } catch (error) {
      const strapiError = getStrapiError(error);
      if (strapiError?.id === "Auth.form.error.invalid") {
        formik.setFieldError("email", "Check your email");
        formik.setFieldError("password", "Check your password");
      } else {
        snackError(translateStrapiError(error));
        console.error(error);
      }
      return
    }

    login(user, jwt);
    setComplete(true);
    snackInfo(`Logged in as ${user.email}`);
    plausible("login");
    pushBack(router);
  };

  return <LoginForm disabled={complete} onSubmit={onSubmit} />;
};

export default LoginControl;

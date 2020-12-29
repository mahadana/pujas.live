import { useRouter } from "next/router";
import { useState } from "react";

import LoginForm from "@/components/LoginForm";
import { apolloClient } from "@/lib/apollo";
import { LOGIN_MUTATION } from "@/lib/schema";
import { useSnackbar } from "@/lib/snackbar";
import { useUser } from "@/lib/user";
import { pushBack, translateStrapiError } from "@/lib/util";

const LoginControl = ({ onSuccess }) => {
  const router = useRouter();
  const { snackError, snackInfo } = useSnackbar();
  const [complete, setComplete] = useState(false);
  const { login, logout } = useUser();

  const onSubmit = async (values, form) => {
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
      snackError(translateStrapiError(error));
      console.error(error);
      return;
    }

    login(user, jwt);
    setComplete(true);
    snackInfo(`Logged in as ${user.email}`);
    pushBack(router);
  };

  return <LoginForm disabled={complete} onSubmit={onSubmit} />;
};

export default LoginControl;

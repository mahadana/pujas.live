import Container from "@material-ui/core/Container";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";

import LoginForm from "@/components/auth/LoginForm";
import plausible from "@/lib/plausible";
import { LOGIN_MUTATION } from "@/lib/schema";
import { useSnackbar } from "@/lib/snackbar";
import { useUser } from "@/lib/user";
import { pushBack, getStrapiError } from "@/lib/util";

const LoginContent = () => {
  const [doLogin] = useMutation(LOGIN_MUTATION);
  const router = useRouter();
  const { snackException, snackInfo } = useSnackbar();
  const { login, logout } = useUser();

  const onSubmit = (values, formik) => {
    (async () => {
      try {
        logout();
        const result = await doLogin({
          variables: {
            input: {
              identifier: values.email,
              password: values.password,
            },
          },
        });

        const { user, jwt } = result.data.login;
        login(user, jwt);
        snackInfo(`Logged in as ${user.email}`);
        plausible("login");
        pushBack(router);
      } catch (error) {
        const strapiError = getStrapiError(error);
        if (strapiError?.id === "Auth.form.error.invalid") {
          formik.setFieldError("email", "Check your email");
          formik.setFieldError("password", "Check your password");
        } else {
          snackException(error);
        }
        formik.setSubmitting(false);
      }
    })();
  };

  return (
    <Container maxWidth="sm">
      <LoginForm onSubmit={onSubmit} />
    </Container>
  );
};

export default LoginContent;

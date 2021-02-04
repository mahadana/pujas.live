import Container from "@material-ui/core/Container";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";

import RegisterForm from "@/components/auth/RegisterForm";
import plausible from "@/lib/plausible";
import { REGISTER_MUTATION } from "@/lib/schema";
import { useSnackbar } from "@/lib/snackbar";
import { useUser } from "@/lib/user";
import { getStrapiError, useRouteBack } from "@/lib/util";

const RegisterContent = () => {
  const [register] = useMutation(REGISTER_MUTATION);
  const router = useRouter();
  const routeBack = useRouteBack(router);
  const { snackException, snackSuccess } = useSnackbar();
  const { login, logout } = useUser();

  const onSubmit = (values, formik, token) => {
    (async () => {
      try {
        logout();
        const result = await register({
          context: {
            headers: {
              "X-Captcha-Token": token,
            },
          },
          variables: {
            input: {
              email: values.email,
              username: values.email,
              password: values.password,
            },
          },
        });

        const { user, jwt } = result.data.register;
        login(user, jwt);
        snackSuccess(`Successfully created account`);
        plausible("register");
        routeBack.push();
      } catch (error) {
        const strapiError = getStrapiError(error);
        if (strapiError?.id === "Auth.form.error.email.taken") {
          formik.setFieldValue("existingEmail", values.email);
          formik.validateForm();
        } else {
          snackException(error);
        }
        formik.setSubmitting(false);
      }
    })();
  };

  return (
    <Container maxWidth="sm">
      <RegisterForm onSubmit={onSubmit} />
    </Container>
  );
};

export default RegisterContent;

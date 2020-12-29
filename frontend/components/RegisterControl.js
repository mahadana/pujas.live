import { useRouter } from "next/router";
import { useState } from "react";

import RegisterForm from "./RegisterForm";
import { apolloClient } from "@/lib/apollo";
import { REGISTER_MUTATION } from "@/lib/schema";
import { useSnackbar } from "@/lib/snackbar";
import { useUser } from "@/lib/user";
import { pushBack, getStrapiError, translateStrapiError } from "@/lib/util";

const RegisterControl = ({ onSuccess }) => {
  const router = useRouter();
  const { snackError, snackSuccess } = useSnackbar();
  const [complete, setComplete] = useState(false);
  const { login, logout } = useUser();

  const onSubmit = async (values, formik, token) => {
    const variables = {
      input: {
        email: values.email,
        username: values.email,
        password: values.password,
      },
    };
    logout();

    let user, jwt;
    try {
      const result = await apolloClient.mutate({
        context: {
          headers: {
            "X-Captcha-Token": token,
          },
        },
        mutation: REGISTER_MUTATION,
        variables,
      });
      ({ user, jwt } = result.data.register);
    } catch (error) {
      const strapiError = getStrapiError(error);
      if (strapiError?.id === "Auth.form.error.email.taken") {
        formik.setFieldValue("existingEmail", values.email);
        formik.validateForm();
      } else {
        snackError(translateStrapiError(error));
        console.error(error);
      }
      return;
    }

    login(user, jwt);
    setComplete(true);
    snackSuccess(`Created account for ${user.email}`);
    pushBack(router);
  };

  return <RegisterForm disabled={complete} onSubmit={onSubmit} />;
};

export default RegisterControl;

import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useFormikContext } from "formik";

import CaptchaForm from "@/components/CaptchaForm";
import Link from "@/components/Link";
import { useUser } from "@/lib/user";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "2rem",
  },
  paper: {
    padding: "1rem",
    textAlign: "center",
    "& .MuiFormControl-root": {
      height: "5em",
    },
    "& .MuiTypography-body2": {
      margin: "1em",
    },
  },
  lead: {
    margin: "1em",
  },
  alert: {
    justifyContent: "center",
  },
}));

const AuthFormInner = ({ children, disabled, email, lead }) => {
  const formik = useFormikContext();
  const classes = useStyles();
  const { logout, user } = useUser();

  const onClickLogout = (event) => {
    event.preventDefault();
    logout();
  };

  useEffect(() => {
    if (email) formik.setFieldValue("email", email);
  }, [email]);

  return (
    <Paper m={4} className={classes.paper}>
      <Typography variant="h3">Pujas.live</Typography>
      <Typography variant="subtitle1" className={classes.lead}>
        {!disabled && user ? (
          <Alert severity="warning" className={classes.alert}>
            You are already logged in as <strong>{user.email}</strong>.
            <br />
            <Link href="/">Go Home</Link> or{" "}
            <Link onClick={onClickLogout} href="/auth/logout">
              Logout
            </Link>
            .
          </Alert>
        ) : (
          lead
        )}
      </Typography>
      {children}
    </Paper>
  );
};

const AuthForm = ({ children, disabled, lead, ...props }) => {
  const classes = useStyles();
  const router = useRouter();
  const email = router?.query?.email || "";
  return (
    <CaptchaForm
      formProps={{ className: classes.root }}
      initialValues={{ email, password: "" }}
      validateOnBlur={false}
      validateOnChange={false}
      {...props}
    >
      <AuthFormInner disabled={disabled} email={email} lead={lead}>
        {children}
      </AuthFormInner>
    </CaptchaForm>
  );
};

export default AuthForm;

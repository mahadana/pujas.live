import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Alert from "@material-ui/lab/Alert";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";

import Link from "./Link";
import ButtonLink from "./ButtonLink";
import { useStyles } from "./RegisterForm";
import { FormHelper, FormTextField, SubmitButton } from "@/lib/form";
import { useUser } from "@/lib/user";
import { loginSchema } from "@/lib/validation";

function LoginForm({ disabled, onSubmit }) {
  const router = useRouter();
  const classes = useStyles();
  const { logout, user } = useUser();

  const onClickLogout = (event) => {
    event.preventDefault();
    logout();
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={loginSchema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={onSubmit}
    >
      <Form className={classes.root}>
        <FormHelper />
        <Paper m={4} className={classes.paper}>
          <Typography variant="h3" className={classes.title}>
            Pujas.live
          </Typography>
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
              "Login to your account to continue..."
            )}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} className={classes.row}>
              <FormTextField
                label="Email"
                name="email"
                type="email"
                autoComplete="username"
                variant="outlined"
                autoFocus
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} className={classes.row}>
              <FormTextField
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} className={classes.row}>
              <SubmitButton
                size="large"
                disabled={disabled}
                startIcon={<ExitToAppIcon />}
              >
                Login
              </SubmitButton>
            </Grid>
            <Grid item xs={12} className={classes.row}>
              <Typography variant="body2">
                <ButtonLink
                  href={{ pathname: "/auth/register", query: router.query }}
                  size="small"
                  variant="outlined"
                  color="secondary"
                  disabled={disabled}
                >
                  Create Account
                </ButtonLink>{" "}
                <ButtonLink
                  href={{
                    pathname: "/auth/forgot-password",
                    query: router.query,
                  }}
                  size="small"
                  disabled={disabled}
                >
                  Forgot Password?
                </ButtonLink>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Form>
    </Formik>
  );
}

export default LoginForm;

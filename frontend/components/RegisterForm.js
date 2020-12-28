import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import Alert from "@material-ui/lab/Alert";
import { useRouter } from "next/router";

import ButtonLink from "./ButtonLink";
import CaptchaForm from "./CaptchaForm";
import Link from "./Link";
import { FormHelper, FormTextField, SubmitButton } from "../lib/form";
import { useUser } from "../lib/user";
import { registerSchema } from "../lib/validation";

export const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "2rem",
  },
  paper: {
    padding: "1rem",
    textAlign: "center",
  },
  lead: {
    margin: "1em",
  },
  alert: {
    justifyContent: "center",
  },
  row: {
    "& > div": {
      height: "5em",
    },
  },
}));

const RegisterForm = ({ disabled, onSubmit }) => {
  const router = useRouter();
  const classes = useStyles();
  const { logout, user } = useUser();

  const onClickLogout = (event) => {
    event.preventDefault();
    logout();
  };

  return (
    <CaptchaForm
      className={classes.root}
      initialValues={{ email: "", password: "" }}
      onSubmit={onSubmit}
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={registerSchema}
    >
      <FormHelper />
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
            "Create an account to continue..."
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
              autoComplete="new-password"
              variant="outlined"
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} className={classes.row}>
            <SubmitButton
              size="large"
              color="secondary"
              disabled={disabled}
              startIcon={<EmojiPeopleIcon />}
            >
              Create Account
            </SubmitButton>
          </Grid>
          <Grid item xs={12} className={classes.row}>
            <Typography variant="body2">
              <ButtonLink
                href={{ pathname: "/auth/login", query: router.query }}
                size="small"
                variant="outlined"
                disabled={disabled}
              >
                Login
              </ButtonLink>{" "}
              if you have an account.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </CaptchaForm>
  );
};

export default RegisterForm;

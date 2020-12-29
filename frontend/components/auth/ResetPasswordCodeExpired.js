import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import AuthNotice from "@/components/auth/AuthNotice";
import Link from "@/components/Link";

const useStyles = makeStyles((theme) => ({
  text: {
    marginTop: "1em",
  },
}));

const ResetPasswordCodeExpired = () => {
  const classes = useStyles();
  return (
    <AuthNotice>
      <Typography variant="h4">Uh Oh!</Typography>
      <Typography variant="body1" className={classes.text}>
        The reset password link <em>has expired</em>.
      </Typography>
      <Typography variant="body1" className={classes.text}>
        <Link href="/auth/forgot-password">
          Please click here to restart the reset password process.
        </Link>
      </Typography>
    </AuthNotice>
  );
};

export default ResetPasswordCodeExpired;

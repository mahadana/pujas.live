import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import AuthNotice from "@/components/auth/AuthNotice";

const useStyles = makeStyles((theme) => ({
  text: {
    marginTop: "1em",
  },
}));

const ForgotPasswordSuccess = ({ email }) => {
  const classes = useStyles();
  return (
    <AuthNotice>
      <Typography variant="h4">Almost there...</Typography>
      <Typography variant="body1" className={classes.text}>
        An email was sent to <strong>{email}</strong>. Please check and click on
        the supplied link.
      </Typography>
      <Typography variant="body1" className={classes.text}>
        If you didn't get an email, please try again. If we do not have account
        with this email, no email will be sent.
      </Typography>
    </AuthNotice>
  );
};

export default ForgotPasswordSuccess;

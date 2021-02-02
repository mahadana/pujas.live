import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import ChangeEmailContent from "@/components/auth/ChangeEmailContent";
import ChangePasswordContent from "@/components/auth/ChangePasswordContent";

const useStyles = makeStyles((theme) => ({
  section: {
    margin: "2em 0",
  },
}));

const AccountContent = () => {
  const classes = useStyles();
  return (
    <Container maxWidth="sm">
      <Typography variant="h3">Account Settings</Typography>
      <Box className={classes.section}>
        <ChangeEmailContent />
      </Box>
      <Box className={classes.section}>
        <ChangePasswordContent />
      </Box>
    </Container>
  );
};

export default AccountContent;

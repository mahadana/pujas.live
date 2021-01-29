import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import ChangeEmailControl from "@/components/auth/ChangeEmailControl";
import ChangePasswordControl from "@/components/auth/ChangePasswordControl";
import Banner from "@/components/Banner";
import Loading from "@/components/Loading";
import Title from "@/components/Title";

const useStyles = makeStyles((theme) => ({
  section: {
    margin: "2em 0",
  },
}));

const AccountPage = () => {
  const classes = useStyles();
  return (
    <>
      <Title title="Account" />
      <Banner />
      <Loading data requireUser>
        {() => (
          <Container maxWidth="sm">
            <Typography variant="h3">Account Settings</Typography>
            <Box className={classes.section}>
              <ChangeEmailControl />
            </Box>
            <Box className={classes.section}>
              <ChangePasswordControl />
            </Box>
          </Container>
        )}
      </Loading>
    </>
  );
};

export default AccountPage;

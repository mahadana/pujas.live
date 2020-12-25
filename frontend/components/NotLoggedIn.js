import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useRouter } from "next/router";

import ButtonLink from "./ButtonLink";
import { getPushBackUrl } from "../lib/util";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexFlow: "column",
    width: "100%",
    height: "50vh",
    textAlign: "center",
  },
  links: {
    margin: "2rem",
    "& a": {
      margin: "1rem",
    },
  },
}));

const NotLoggedIn = () => {
  const router = useRouter();
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Typography variant="h2">
        You must be logged in to view this page.
      </Typography>
      <Box className={classes.links}>
        <ButtonLink
          href={getPushBackUrl(router, "/auth/register")}
          size="large"
          variant="contained"
          color="secondary"
          startIcon={<EmojiPeopleIcon />}
        >
          Create Account
        </ButtonLink>

        <ButtonLink
          href={getPushBackUrl(router, "/auth/login")}
          size="large"
          variant="contained"
          color="primary"
          startIcon={<ExitToAppIcon />}
        >
          Login
        </ButtonLink>
      </Box>
    </Box>
  );
};

export default NotLoggedIn;

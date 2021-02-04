import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { fade, makeStyles } from "@material-ui/core/styles";

import Link from "@/components/Link";
import UserButton from "@/components/UserButton";
import ButtonLink from "@/components/ButtonLink";
import { siteName } from "@/lib/util";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "9rem",
    width: "100%",
    backgroundImage: `linear-gradient(
        ${fade(theme.palette.background.default, 0)} 0%,
        ${fade(theme.palette.background.default, 0)} 60%,
        ${fade(theme.palette.background.default, 0.4)} 75%,
        ${fade(theme.palette.background.default, 1)} 90%), url('/banner.jpg')`,
    backgroundSize: "cover",
  },
  container: {
    position: "relative",
    height: "9rem",
    width: "100%",
    color: "white",
    "& a": {
      color: "white",
    },
  },
  ximage: {
    position: "absolute",
    objectFit: "cover",
    width: "100%",
    height: "100%",
  },
  title: {
    position: "absolute",
    top: "1.5rem",
    left: -1,
    fontSize: "2.5rem",
    fontWeight: 400,
  },
  summary: {
    position: "absolute",
    top: "4.4rem",
    left: 1,
    fontSize: "0.9rem",
    lineHeight: "1.1em",
    fontWeight: "bold",
  },
  login: {
    position: "absolute",
    top: ".5rem",
    right: "-.5rem",
  },
}));

const Banner = ({ userButton = true }) => {
  const classes = useStyles();
  return (
    <header className={classes.root}>
      <Container maxWidth="lg">
        <Box className={classes.container}>
          <Typography variant="h1" className={classes.title}>
            <Link href="/">{siteName}</Link>
          </Typography>
          <Typography variant="caption" className={classes.summary}>
            Livestreams and meditation groups in the Thai Forest tradition of
            Ajahn Chah
          </Typography>
          <Box className={classes.login}>
            {userButton && <UserButton />}
            <ButtonLink className={classes.loginLink} href="/about">
              About
            </ButtonLink>
          </Box>
        </Box>
      </Container>
    </header>
  );
};

export default Banner;

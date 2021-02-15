import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { fade, makeStyles } from "@material-ui/core/styles";

import ButtonBaseLink from "@/components/ButtonBaseLink";
import ButtonLink from "@/components/ButtonLink";
import UserButton from "@/components/UserButton";
import { siteName } from "@/lib/util";

const validImageNumbers = [2, 4, 7, 9, 10, 11, 13];

const getBannerImageUrl = () =>
  "/cropped" +
  validImageNumbers[Math.floor(Math.random() * validImageNumbers.length)] +
  ".jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "10rem",
    backgroundColor: "#202a13",
    backgroundImage:
      `linear-gradient(
        ${fade(theme.palette.background.default, 0)} 0%,
        ${fade(theme.palette.background.default, 0)} 60%,
        ${fade(theme.palette.background.default, 0.4)} 75%,
        ${fade(theme.palette.background.default, 1)} 90%)` +
      (typeof window === "undefined" ? "" : `, url(${getBannerImageUrl()})`),
    backgroundSize: "cover",
    "&, & a": {
      color: "white",
      textShadow: "2px 2px 2px black",
    },
    [theme.breakpoints.up("sm")]: {
      height: "9rem",
    },
  },
  container: {
    width: "100%",
    height: "10rem",
    [theme.breakpoints.up("sm")]: {
      height: "9rem",
    },
  },
  links: {
    textAlign: "right",
    marginRight: "-.5rem",
  },
  homeLink: {
    display: "block",
    padding: "0 0.5rem",
    textAlign: "center",
    borderRadius: "0.5rem",
    "&:hover": {
      backgroundColor: fade(theme.palette.primary.main, 0.1),
    },
    [theme.breakpoints.up("sm")]: {
      display: "inline-block",
      textAlign: "left",
      marginTop: "-1.4rem",
      marginLeft: "-0.5rem",
      paddingTop: "0.25rem",
      paddingBottom: "0.25rem",
    },
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: 400,
  },
  summary: {
    marginLeft: 1,
    fontSize: "0.9rem",
    lineHeight: "1.3em",
    fontWeight: "bold",
  },
}));

const Banner = ({ userButton = true }) => {
  const classes = useStyles();
  return (
    <header className={classes.root}>
      <Container maxWidth="lg">
        <div className={classes.container}>
          <div className={classes.links}>
            {userButton && <UserButton />}
            <ButtonLink className={classes.loginLink} href="/about">
              About
            </ButtonLink>
          </div>
          <ButtonBaseLink className={classes.homeLink} href="/">
            <Typography variant="h1" className={classes.title}>
              {siteName}
            </Typography>
            <Typography variant="body2" className={classes.summary}>
              Livestreams and meditation groups in the Thai Forest tradition
            </Typography>
          </ButtonBaseLink>
        </div>
      </Container>
    </header>
  );
};

export default Banner;

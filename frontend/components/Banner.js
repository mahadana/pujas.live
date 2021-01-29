import { makeStyles } from "@material-ui/core";

import Link from "@/components/Link";
import UserButton from "@/components/UserButton";
import ButtonLink from "@/components/ButtonLink";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    height: "10em",
    marginBottom: "2em",
  },
  image: {
    position: "absolute",
    objectFit: "cover",
    width: "100%",
    height: "100%",
  },
  title: {
    position: "absolute",
    zIndex: 100,
    margin: 0,
    top: "1.5rem",
    left: "1.5rem",
    color: "white",
    "& > a": {
      fontSize: "1.5em",
      fontWeight: 400,
      color: "white",
      textDecoration: "none",
    },
  },
  summary: {
    position: "absolute",
    zIndex: 100,
    margin: 0,
    top: "4.75rem",
    left: "1.65rem",
    fontSize: "1.2em",
    fontWeight: 500,
    color: "white",
  },
  login: {
    position: "absolute",
    top: ".5em",
    right: "1em",
    color: "white",
    "& a, & button": {
      color: "white",
    },
  },
}));

const Banner = ({ userButton = true }) => {
  const classes = useStyles();
  return (
    <header className={classes.root}>
      <img className={classes.image} src="/banner.jpg" alt="banner" />
      <h1 className={classes.title}>
        <Link href="/">Pujas.live</Link>
      </h1>
      <p className={classes.summary}>
        Livestreams and meditation groups in the Thai Forest tradition of Ajahn
        Chah
      </p>

      <div className={classes.login}>
        {userButton && <UserButton />}
        <ButtonLink className={classes.loginLink} href="/about">
          About
        </ButtonLink>
      </div>
    </header>
  );
};

export default Banner;

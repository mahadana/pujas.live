import { makeStyles } from "@material-ui/core";

import Link from "./Link";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
    height: "10em",
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
}));

const Banner = () => {
  const classes = useStyles();
  return (
    <header className={classes.container}>
      <img className={classes.image} src="/banner.jpg" alt="banner" />
      <h1 className={classes.title}>
        <Link href="/">Pujas.live</Link>
      </h1>
      <p className={classes.summary}>
        Livestreams and meditation groups in the Thai Forest tradition of Ajahn
        Chah
      </p>
    </header>
  );
};

export default Banner;

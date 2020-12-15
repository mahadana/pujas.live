import Image from "next/image";
import { makeStyles, withTheme } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
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
    top: "2rem",
    left: "2rem",
    fontSize: "2.5em",
    color: "white",
  },
  summary: {
    position: "absolute",
    zIndex: 100,
    margin: 0,
    top: "5rem",
    left: "2rem",
    fontWeight: "bold",
    color: "white",
  },
}));

const Banner = () => {
  const classes = useStyles();
  return (
    <header className={classes.container}>
      <img className={classes.image} src="/banner.jpg" alt="banner" />
      <h1 className={classes.title}>Pujas.live</h1>
      <p className={classes.summary}>
        Livestreams and meditation groups in the Thai Forest tradition of Ajahn
        Chah
      </p>
    </header>
  );
};

export default Banner;

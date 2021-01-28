import Box from "@material-ui/core/Box";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import NoSsr from "@material-ui/core/NoSsr";
import Image from "next/image";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: "min(10vh, 10vw)",
    left: "min(10vh, 10vw)",
    fontSize: 40,
    width: "10vw",
    height: "20vw",
    zIndex: 1000,
  },
}));

const LoadingProgress = ({ loading }) => {
  const classes = useStyles();

  return (
    <NoSsr>
      <Fade
        in={loading}
        mountOnEnter
        timeout={{ enter: 400, exit: 2000 }}
        unmountOnExit
      >
        <Box className={classes.root}>
          <Image src="/monk.png" layout="fill" />
        </Box>
      </Fade>
    </NoSsr>
  );
};

export default LoadingProgress;

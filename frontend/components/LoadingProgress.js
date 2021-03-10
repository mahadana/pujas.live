import Box from "@material-ui/core/Box";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import NoSsr from "@material-ui/core/NoSsr";
import Image from "next/image";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: "0.2rem",
    left: "0.2rem",
    width: "4rem",
    height: "8rem",
    zIndex: 10000,
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
          <Image src="/monk.png" width="50" height="100" />
        </Box>
      </Fade>
    </NoSsr>
  );
};

export default LoadingProgress;

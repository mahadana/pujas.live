import Box from "@material-ui/core/Box";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import NoSsr from "@material-ui/core/NoSsr";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: "0.2rem",
    left: "0.2rem",
    width: "min(15vw, 15vh)",
    height: "min(30vw, 30vh)",
    zIndex: 10000,
    "& img": {
      display: "block",
      width: "100%",
      height: "100%",
    },
  },
}));

const LoadingProgress = ({ loading }) => {
  const classes = useStyles();

  return (
    <NoSsr>
      <Fade
        closeAfterTransition
        in={loading}
        mountOnEnter
        timeout={{ enter: 2000, exit: 10000 }}
        unmountOnExit
      >
        <Box className={classes.root}>
          <img src="/_next/image?url=%2Fmonk.png&w=128&q=75" alt="patience" />
        </Box>
      </Fade>
    </NoSsr>
  );
};

export default LoadingProgress;

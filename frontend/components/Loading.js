import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "40vh",
  },
  skeleton: {
    width: "100%",
    height: "100%",
    maxWidth: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const Loading = () => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Skeleton
        variant="rect"
        animation="wave"
        className={classes.skeleton}
      ></Skeleton>
    </Box>
  );
};

export default Loading;

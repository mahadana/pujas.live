import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    position: "absolute",
    zIndex: 1000,
    bottom: 0,
    right: 0,
    width: 10,
    height: "100%",
  },
  performanceLong: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 5,
    backgroundColor: "red",
  },
  performanceMiss: {
    position: "absolute",
    bottom: 0,
    right: 5,
    width: 5,
    backgroundColor: "orange",
  },
});

const ChantPerformanceBars = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.performanceMiss} id="chant-performance-miss" />
      <div className={classes.performanceLong} id="chant-performance-long" />
    </div>
  );
};

export default ChantPerformanceBars;

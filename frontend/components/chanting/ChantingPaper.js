import { makeStyles } from "@material-ui/core/styles";
import { forwardRef } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "100%",
    height: "100%",
    padding: "1rem 2rem",
    overflow: "hidden",
    overflowY: "scroll",
  },
}));

const ChantingPaper = forwardRef(({ children }, ref) => {
  const classes = useStyles();
  return (
    <div className={classes.root} ref={ref}>
      {children}
    </div>
  );
});

ChantingPaper.displayName = "ChantingPaper";

export default ChantingPaper;

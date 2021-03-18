import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import { memo } from "react";

import ChantScroller from "@/components/chanting/ChantScroller";

const useStyles = makeStyles({
  fade: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});

const ChantScrollerWrapper = memo((props) => {
  const classes = useStyles();
  return (
    <Fade in={Boolean(props.chantSet)} timeout={500}>
      <div className={classes.fade}>
        <ChantScroller {...props} />
      </div>
    </Fade>
  );
});

ChantScrollerWrapper.displayName = "ChantScrollerWrapper";

export default ChantScrollerWrapper;

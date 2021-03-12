import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import { memo, useCallback } from "react";

import ChantToc from "@/components/chanting/ChantToc";

const useStyles = makeStyles({
  fade: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});

const ChantTocWrapper = memo(
  ({ dispatch, state }) => {
    const classes = useStyles();

    const onOpen = useCallback(
      (chantSet) => dispatch({ type: "OPEN_CHANT_SET", chantSet }),
      [dispatch]
    );

    const toc = state.chantData?.toc;

    return (
      <Fade in={Boolean(toc) && state.view === "TOC"}>
        <div className={classes.fade}>
          <ChantToc fullToc={state.fullToc} onOpen={onOpen} toc={toc} />
        </div>
      </Fade>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch &&
    prev.state.chantData === next.state.chantData &&
    prev.state.fullToc === next.state.fullToc &&
    prev.state.view === next.state.view
);

ChantTocWrapper.displayName = "ChantTocWrapper";

export default ChantTocWrapper;

import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import { memo, useCallback, useState } from "react";

import ChantToc from "@/components/chanting/ChantToc";
import ChantCloseTocButton from "@/components/chanting/inputs/ChantCloseTocButton";
import ChantFullTocButton from "@/components/chanting/inputs/ChantFullTocButton";

const useStyles = makeStyles({
  fade: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  close: {
    position: "absolute",
    zIndex: 100,
    top: "-0.35rem",
    right: "-0.35rem",
    width: "3.75rem",
    height: "3.75rem",
  },
  fullToc: {
    position: "absolute",
    zIndex: 100,
    bottom: 0,
    right: 0,
    width: "3.75rem",
    height: "3.75rem",
  },
});

const ChantTocWrapper = memo(
  ({ dispatch, state }) => {
    const [fullToc, setFullToc] = useState(false);
    const classes = useStyles();

    const onClickCloseToc = useCallback(() => dispatch({ type: "CLOSE" }), [
      dispatch,
    ]);
    const onClickFullToc = useCallback(
      () => setFullToc((fullToc) => !fullToc),
      [setFullToc]
    );
    const onOpen = useCallback(
      (tocChantSet) => dispatch({ type: "SET_TOC_CHANT_SET", tocChantSet }),
      [dispatch]
    );

    return (
      <Fade in={state.view === "TOC"} timeout={500}>
        <div className={classes.fade}>
          <div className={classes.close}>
            <ChantCloseTocButton onClick={onClickCloseToc} />
          </div>
          <div className={classes.fullToc}>
            <ChantFullTocButton fullToc={fullToc} onClick={onClickFullToc} />
          </div>
          {state.chantData?.toc && (
            <ChantToc
              fullToc={fullToc}
              onOpen={onOpen}
              toc={state.chantData.toc}
            />
          )}
        </div>
      </Fade>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch &&
    prev.state.chantData === next.state.chantData &&
    prev.state.view === next.state.view
);

ChantTocWrapper.displayName = "ChantTocWrapper";

export default ChantTocWrapper;

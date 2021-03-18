import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import { memo, useState } from "react";

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

const ChantTocWrapper = memo(({ chantSet, onClose, onOpen, toc }) => {
  const [fullToc, setFullToc] = useState(false);
  const classes = useStyles();

  const toggleFullToc = () => setFullToc((fullToc) => !fullToc);

  return (
    <Fade in={!chantSet} timeout={500}>
      <div className={classes.fade}>
        <div className={classes.close}>
          <ChantCloseTocButton onClick={onClose} />
        </div>
        <div className={classes.fullToc}>
          <ChantFullTocButton fullToc={fullToc} onClick={toggleFullToc} />
        </div>
        <ChantToc fullToc={fullToc} onOpen={onOpen} toc={toc} />
      </div>
    </Fade>
  );
});

ChantTocWrapper.displayName = "ChantTocWrapper";

export default ChantTocWrapper;

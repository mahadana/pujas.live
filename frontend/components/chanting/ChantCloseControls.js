import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";

import { useChantIdle } from "@/components/chanting/ChantIdleProvider";
import ChantCloseButton from "@/components/chanting/inputs/ChantCloseButton";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    zIndex: 100,
    top: 0,
    right: 0,
    width: ({ visible }) => (visible ? "3.75rem" : 0),
    height: ({ visible }) => (visible ? "3.75rem" : 0),
  },
  fade: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  button: {
    position: "absolute",
    top: ({ toc }) => (toc ? "-0.35rem" : 0),
    right: ({ toc }) => (toc ? "-0.35rem" : 0),
    width: "100%",
    height: "100%",
    transition: "all 0.5s ease-out",
  },
}));

const ChantCloseControls = ({ dispatch, state }) => {
  const idle = useChantIdle();
  const [visible, setVisible] = useState(false);
  const classes = useStyles({ toc: state.view === "TOC", visible });

  const onEnter = () => setVisible(true);
  const onExited = () => setVisible(false);

  const open = state.view === "TOC" || state.settings || !idle;

  return (
    <div className={classes.root}>
      <Fade in={open} onEnter={onEnter} onExited={onExited}>
        <div className={classes.fade}>
          <div className={classes.button}>
            <ChantCloseButton dispatch={dispatch} />
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default ChantCloseControls;

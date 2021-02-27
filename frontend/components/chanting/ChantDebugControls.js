import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";

import { useChantIdle } from "@/components/chanting/ChantIdleProvider";
import ChantDebugButton from "@/components/chanting/inputs/ChantDebugButton";
import ChantHighlightButton from "@/components/chanting/inputs/ChantHighlightButton";
import ChantPerformanceButton from "@/components/chanting/inputs/ChantPerformanceButton";
import ChantTimingButton from "@/components/chanting/inputs/ChantTimingButton";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    zIndex: 100,
    bottom: 0,
    right: 0,
    width: ({ debug, visible }) =>
      visible ? `${(debug ? 4 : 1) * 3.75}rem` : 0,
    height: ({ visible }) => (visible ? "3.75rem" : 0),
  },
  fade: {
    width: "100%",
    height: "100%",
  },
  buttons: {
    width: "100%",
    height: "100%",
    textAlign: "right",
  },
}));

const ChantDebugControls = ({ dispatch, state }) => {
  const idle = useChantIdle();
  const [visible, setVisible] = useState(false);
  const classes = useStyles({ debug: state.debug, visible });

  const onEnter = () => setVisible(true);
  const onExited = () => setVisible(false);

  const open = state.settings || !idle;

  return (
    <div className={classes.root}>
      <Fade in={open} onEnter={onEnter} onExited={onExited}>
        <div className={classes.fade}>
          <div className={classes.buttons}>
            {state.debug && (
              <>
                <ChantHighlightButton dispatch={dispatch} state={state} />
                <ChantPerformanceButton dispatch={dispatch} state={state} />
                <ChantTimingButton dispatch={dispatch} state={state} />
              </>
            )}
            <ChantDebugButton dispatch={dispatch} state={state} />
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default ChantDebugControls;

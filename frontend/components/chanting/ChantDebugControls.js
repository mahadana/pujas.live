import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import { memo, useState } from "react";

import { useChantIdle } from "@/components/chanting/ChantIdleProvider";
import ChantDebugButton from "@/components/chanting/inputs/ChantDebugButton";
import ChantDiagnosticsButton from "@/components/chanting/inputs/ChantDiagnosticsButton";
import ChantFullTocButton from "@/components/chanting/inputs/ChantFullTocButton";
import ChantHighlightButton from "@/components/chanting/inputs/ChantHighlightButton";
import ChantAudioButton from "@/components/chanting/inputs/ChantAudioButton";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    zIndex: 100,
    bottom: 0,
    right: 0,
    width: ({ debug, visible }) =>
      visible ? `${(debug ? 5 : 1) * 3.75}rem` : 0,
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

const ChantDebugControls = memo(
  ({ dispatch, state }) => {
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
                  <ChantFullTocButton dispatch={dispatch} state={state} />
                  <ChantDiagnosticsButton dispatch={dispatch} state={state} />
                  <ChantHighlightButton dispatch={dispatch} state={state} />
                  <ChantAudioButton dispatch={dispatch} state={state} />
                </>
              )}
              <ChantDebugButton dispatch={dispatch} state={state} />
            </div>
          </div>
        </Fade>
      </div>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch &&
    prev.state.audio === next.state.audio &&
    prev.state.debug === next.state.debug &&
    prev.state.diagnostics === next.state.diagnostics &&
    prev.state.fullToc === next.state.fullToc &&
    prev.state.highlight === next.state.highlight
);

export default ChantDebugControls;

import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import { memo, useState } from "react";

import { useChantIdle } from "@/components/chanting/ChantIdleProvider";
import ChantFullscreenButton from "@/components/chanting/inputs/ChantFullscreenButton";
import ChantFullTocButton from "@/components/chanting/inputs/ChantFullTocButton";
import ChantSettingsButton from "@/components/chanting/inputs/ChantSettingsButton";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    zIndex: 100,
    bottom: 0,
    right: 0,
    width: ({ count, visible }) => (visible ? `${count * 3.75}rem` : 0),
    height: ({ visible }) => (visible ? "3.75rem" : 0),
    [theme.breakpoints.up("sm")]: {
      width: ({ visible }) => (visible ? "3.75rem" : 0),
      height: ({ count, visible }) => (visible ? `${count * 3.75}rem` : 0),
    },
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

const ChantExtraControls = memo(
  ({ dispatch, state }) => {
    const idle = useChantIdle();
    const [visible, setVisible] = useState(false);
    const classes = useStyles({ count: state.view === "TOC" ? 1 : 2, visible });

    const onEnter = () => setVisible(true);
    const onExited = () => setVisible(false);

    const open = state.settings || !idle;

    return (
      <div className={classes.root}>
        <Fade in={open} onEnter={onEnter} onExited={onExited}>
          <div className={classes.fade}>
            <div className={classes.buttons}>
              {state.view === "TOC" ? (
                <ChantFullTocButton dispatch={dispatch} state={state} />
              ) : (
                <>
                  <ChantSettingsButton dispatch={dispatch} state={state} />
                  <ChantFullscreenButton dispatch={dispatch} state={state} />
                </>
              )}
            </div>
          </div>
        </Fade>
      </div>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch &&
    prev.state.fullscreen === next.state.fullscreen &&
    prev.state.fullToc === next.state.fullToc &&
    prev.state.settings === next.state.settings &&
    prev.state.view === next.state.view
);

export default ChantExtraControls;

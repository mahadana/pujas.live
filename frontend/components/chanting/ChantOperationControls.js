import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import { memo, useState } from "react";

import { useChantIdle } from "@/components/chanting/ChantIdleProvider";
import ChantAudioButton from "@/components/chanting/inputs/ChantAudioButton";
import ChantPlayButton from "@/components/chanting/inputs/ChantPlayButton";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    zIndex: 20,
    bottom: 0,
    left: 0,
    width: ({ visible }) => (visible ? "7.5rem" : 0),
    height: ({ visible }) => (visible ? "3.75rem" : 0),
    [theme.breakpoints.up("sm")]: {
      top: "3.75rem",
      right: 0,
      bottom: "auto",
      left: "auto",
      width: ({ visible }) => (visible ? "3.75rem" : 0),
      height: ({ visible }) => (visible ? "7.5rem" : 0),
    },
  },
  fade: {
    width: "100%",
    height: "100%",
  },
  buttons: {
    width: "100%",
    height: "100%",
    // borderTop: `1px solid ${theme.palette.text.disabled}`,
    // backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up("sm")]: {
      // borderTop: "none",
      // backgroundColor: "transparent",
      textAlign: "center",
      "& > button": {
        display: "flex",
      },
    },
  },
}));

const ChantOperationControls = memo(
  ({ dispatch, state }) => {
    const idle = useChantIdle();
    const [visible, setVisible] = useState(false);
    const classes = useStyles({ visible });

    const onEnter = () => setVisible(true);
    const onExited = () => setVisible(false);

    const open = state.view === "CHANT" && (state.settings || !idle);

    return (
      <div className={classes.root}>
        <Fade in={open} onEnter={onEnter} onExited={onExited}>
          <div className={classes.fade}>
            <div className={classes.buttons}>
              <ChantPlayButton dispatch={dispatch} state={state} />
              <ChantAudioButton dispatch={dispatch} state={state} />
            </div>
          </div>
        </Fade>
      </div>
    );
  },
  (prev, next) =>
    prev.dispatch === prev.dispatch &&
    prev.state.audio === next.state.audio &&
    prev.state.playing === next.state.playing &&
    prev.state.settings === next.state.settings &&
    prev.state.view === next.state.view
);

export default ChantOperationControls;

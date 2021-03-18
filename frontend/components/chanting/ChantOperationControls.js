import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { memo } from "react";

import ChantAudioButton from "@/components/chanting/inputs/ChantAudioButton";
import ChantPlayButton from "@/components/chanting/inputs/ChantPlayButton";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    zIndex: 100,
    [theme.breakpoints.down("xs")]: {
      bottom: 0,
      left: 0,
      width: "7.5rem",
      height: "3.75rem",
    },
    [theme.breakpoints.up("sm")]: {
      bottom: "7.5rem",
      right: 0,
      width: "3.75rem",
      height: "7.5rem",
      textAlign: "center",
      "& > button": {
        display: "flex",
      },
    },
  },
}));

const ChantOperationControls = memo(
  ({ dispatch, state }) => {
    const classes = useStyles();
    return state.view === "TOC" ? null : (
      <div className={clsx(classes.root, "chant-controls")}>
        <ChantPlayButton dispatch={dispatch} state={state} />
        <ChantAudioButton dispatch={dispatch} state={state} />
      </div>
    );
  },
  (prev, next) =>
    prev.dispatch === prev.dispatch &&
    prev.state.audio === next.state.audio &&
    prev.state.controls === next.state.controls &&
    prev.state.playing === next.state.playing &&
    prev.state.settings === next.state.settings &&
    prev.state.view === next.state.view
);

ChantOperationControls.displayName = "ChantOperationControls";

export default ChantOperationControls;

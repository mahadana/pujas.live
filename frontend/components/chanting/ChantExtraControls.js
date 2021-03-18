import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { memo } from "react";

import ChantFullscreenButton from "@/components/chanting/inputs/ChantFullscreenButton";
import ChantFullTocButton from "@/components/chanting/inputs/ChantFullTocButton";
import ChantSettingsButton from "@/components/chanting/inputs/ChantSettingsButton";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    zIndex: 100,
    bottom: 0,
    right: 0,
    [theme.breakpoints.down("xs")]: {
      width: ({ count }) => `${count * 3.75}rem`,
      height: "3.75rem",
    },
    [theme.breakpoints.up("sm")]: {
      width: "3.75rem",
      height: ({ count }) => `${count * 3.75}rem`,
    },
  },
}));

const ChantExtraControls = memo(
  ({ dispatch, state }) => {
    const classes = useStyles({ count: state.view === "TOC" ? 1 : 2 });
    return (
      <div className={clsx(classes.root, "chant-controls")}>
        {state.view === "TOC" ? (
          <ChantFullTocButton dispatch={dispatch} state={state} />
        ) : (
          <>
            <ChantSettingsButton dispatch={dispatch} state={state} />
            <ChantFullscreenButton dispatch={dispatch} state={state} />
          </>
        )}
      </div>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch &&
    prev.state.controls === next.state.controls &&
    prev.state.fullscreen === next.state.fullscreen &&
    prev.state.fullToc === next.state.fullToc &&
    prev.state.settings === next.state.settings &&
    prev.state.view === next.state.view
);

export default ChantExtraControls;

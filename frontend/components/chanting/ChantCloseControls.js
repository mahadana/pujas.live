import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { memo } from "react";

import ChantCloseButton from "@/components/chanting/inputs/ChantCloseButton";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    zIndex: 100,
    top: ({ toc }) => (toc ? "-0.35rem" : 0),
    right: ({ toc }) => (toc ? "-0.35rem" : 0),
    width: "3.75rem",
    height: "3.75rem",
  },
}));

const ChantCloseControls = memo(({ dispatch, state }) => {
  const classes = useStyles({ toc: state.view === "TOC" });
  return (
    <div className={clsx(classes.root, "chant-controls")}>
      <ChantCloseButton dispatch={dispatch} />
    </div>
  );
});

ChantCloseControls.displayName = "ChantCloseControls";

export default ChantCloseControls;

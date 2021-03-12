import { makeStyles } from "@material-ui/core/styles";
import { memo, useEffect, useRef, useState } from "react";

import { useChantIdle } from "@/components/chanting/ChantIdleProvider";
import ChantSet from "@/components/chanting/ChantSet";

const useStyles = makeStyles((theme) => ({
  root: ({ fullscreen, highlight, idle }) => ({
    position: "absolute",
    cursor: idle && fullscreen ? "none" : "inherit",
    top: 0,
    right: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    overflowY: "scroll",
    scrollbarWidth: "none",
    "-ms-overflow-style": "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "&:focus": {
      outline: "none",
    },
    [theme.breakpoints.up("sm")]: {
      padding: "1rem",
    },
    "& .chant-active": {
      backgroundColor: highlight ? "rgba(255, 255, 0, 0.4)" : "inherit",
    },
  }),
}));

const ChantScroller = memo(({ dispatch, state }) => {
  const [chantSet, setChantSet] = useState(null);
  const idle = useChantIdle();
  const domRef = useRef();
  const classes = useStyles({ ...state, idle });

  const { model } = state;

  useEffect(() => {
    model.attach(domRef.current);
    model.setDispatch(dispatch);
    model.setState(state);
    return () => model.detach();
  }, []);

  useEffect(() => {
    model.setDispatch(dispatch);
    model.setState(state, setChantSet);
  }, [dispatch, setChantSet, state]);

  return (
    <div className={classes.root} ref={domRef} tabIndex="0">
      {chantSet && <ChantSet chantSet={chantSet} />}
    </div>
  );
});

export default ChantScroller;

import { makeStyles } from "@material-ui/core/styles";
import { useEffect } from "react";

import { useChantReducer } from "@/components/chanting/ChantReducer";
import ChantScrollerWrapper from "@/components/chanting/ChantScrollerWrapper";
import ChantTocWrapper from "@/components/chanting/ChantTocWrapper";

const useStyles = makeStyles((theme) => ({
  root: ({ maximize }) => ({
    position: "fixed",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    overflow: "hidden",
    fontSize: "1.25rem",
    ...(maximize
      ? {
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          // This is necessary to prevent a bug on iOS that occasionally causes
          // the right side of the window to go blank.
          borderRadius: "0.01px",
        }
      : {
          width: "90vw",
          maxWidth: "48rem",
          height: "90vh",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "0.25rem",
          boxShadow: "1px 1px 6px rgb(0 0 0 / 80%)",
        }),
  }),
}));

const ChantWindow = ({
  chantData = null,
  chantSet: propsChantSet = null,
  disableAudio = false,
  disableFullScreen = false,
  disableReturnToc = false,
  disableToc = false,
  onClose,
}) => {
  const values = {
    chantData,
    disableAudio,
    disableFullScreen,
    disableReturnToc,
    disableToc,
    propsChantSet,
  };
  const [state, dispatch] = useChantReducer(values);
  const classes = useStyles(state);

  useEffect(() => {
    dispatch({ type: "INITIALIZE", values });
  }, [
    chantData,
    disableAudio,
    disableFullScreen,
    disableReturnToc,
    disableToc,
    propsChantSet,
  ]);

  useEffect(() => {
    if (state.view === "CLOSE") onClose?.();
  }, [state.view]);

  return (
    <div className={classes.root}>
      <ChantScrollerWrapper dispatch={dispatch} state={state} />
      <ChantTocWrapper dispatch={dispatch} state={state} />
    </div>
  );
};

export default ChantWindow;

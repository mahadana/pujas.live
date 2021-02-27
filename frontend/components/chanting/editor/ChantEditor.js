import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useRef } from "react";

import ButtonLink from "@/components/ButtonLink";
import Chant from "@/components/chanting/Chant";
import ChantEditorJsonButton from "@/components/chanting/editor/ChantEditorJsonButton";
import {
  exportTimingToStore,
  importTimingFromStore,
  useChantEditorReducer,
} from "@/components/chanting/editor/ChantEditorReducer";
import ChantEditorMediaUrlButton from "@/components/chanting/editor/ChantEditorMediaUrlButton";
import ChantEditorPlaybackSlider from "@/components/chanting/editor/ChantEditorPlaybackSlider";
import ChantEditorTable from "@/components/chanting/editor/ChantEditorTable";
import ChantEditorTimeControl from "@/components/chanting/editor/ChantEditorTimeControl";

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "Gentium Incantation",
    "& audio": {
      position: "sticky",
      top: 5,
      height: "2.5rem",
      width: "100%",
    },
  },
  buttons: {
    float: "right",
  },
}));

const ChantEditor = ({ chant }) => {
  const [state, dispatch] = useChantEditorReducer({ chant });
  const mediaPlayerRef = useRef();
  const classes = useStyles();

  useEffect(
    () =>
      dispatch({
        type: "SET_MEDIA_PLAYER",
        mediaPlayer: mediaPlayerRef.current,
      }),
    [mediaPlayerRef.current]
  );

  useEffect(() => {
    if (state.chant) {
      if (!state.timing || state.timing.id !== state.chant.id) {
        const importedTiming = importTimingFromStore(state.chant.id);
        dispatch({ type: "IMPORT_TIMING", importedTiming });
      } else {
        exportTimingToStore(chant.id, state.exportedTiming);
      }
    } else {
      dispatch({ type: "RESET_TIMING" });
    }
  }, [state.chant, state.timing]);

  useEffect(() => {
    if (state.mediaPlayer) {
      state.mediaPlayer.src = state.timing?.mediaUrl ?? "";
    }
  }, [state.mediaPlayer, state.timing?.mediaUrl]);

  useEffect(() => {
    if (state.mediaPlayer) {
      state.mediaPlayer.playbackRate = state.playbackRate;
      console.log(state.mediaPlayer.playbackRate);
    }
  }, [state.mediaPlayer, state.playbackRate]);

  const toggleView = () => dispatch({ type: "TOGGLE_VIEW" });

  return (
    <div className={classes.root}>
      <div className={classes.buttons}>
        <ButtonLink href="/chantrain" variant="outlined">
          Table of Contents
        </ButtonLink>{" "}
        <Button onClick={toggleView} variant="outlined">
          {state.view === "EDIT" ? "Styled" : "Edit"}
        </Button>{" "}
        <ChantEditorJsonButton
          dispatch={dispatch}
          state={state}
          variant="outlined"
        >
          JSON
        </ChantEditorJsonButton>
      </div>
      <h1>Chant Training</h1>
      <h2>{`${chant.id} ${chant.title}`}</h2>
      <p>
        Media URL: {state.timing?.mediaUrl ?? ""}{" "}
        <ChantEditorMediaUrlButton
          dispatch={dispatch}
          size="small"
          state={state}
          variant="outlined"
        >
          Update
        </ChantEditorMediaUrlButton>{" "}
        <br />
        <ChantEditorPlaybackSlider dispatch={dispatch} state={state} />
      </p>
      <audio autoPlay={false} controls ref={mediaPlayerRef} />
      <ChantEditorTimeControl dispatch={dispatch} state={state} />
      {state.view === "EDIT" && state.timing && (
        <ChantEditorTable dispatch={dispatch} state={state} />
      )}
      {state.view === "STYLED" && <Chant chant={chant} />}
    </div>
  );
};

export default ChantEditor;

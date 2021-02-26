import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import _isEqual from "lodash/isEqual";
import _isFinite from "lodash/isFinite";
import _isObject from "lodash/isObject";
import { useRouter } from "next/router";
import { useEffect, useReducer, useRef, useState } from "react";

import ButtonLink from "@/components/ButtonLink";
import Chant from "@/components/chanting/Chant";
import ChantFontStyle from "@/components/chanting/ChantFontStyle";
import ChantLoader from "@/components/chanting/ChantLoader";
import ChantSetMediaDialog from "@/components/chanting/inputs/ChantSetMediaDialog";
import PageLayout from "@/components/PageLayout";
import Title from "@/components/Title";
import { useSnackbar } from "@/lib/snackbar";

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "Gentium Incantation",
    "& audio": {
      position: "sticky",
      top: 5,
      height: "2.5rem",
      width: "100%",
    },
    "& button:focus, & .active": {
      backgroundColor: "rgba(255, 255, 0, 0.3)",
    },
    "& thead td": {
      fontWeight: "bold",
    },
  },
  buttons: {
    float: "right",
  },
}));

const timeToHuman = (time) => {
  time = parseFloat(time);
  if (isNaN(time)) {
    return "";
  } else {
    const minutes = parseInt(time / 60);
    const seconds = time - minutes * 60;
    return String(minutes) + ":" + seconds.toFixed(1).padStart(4, "0");
  }
};

const humanToTime = (human) => {
  const match = String(human)
    .trim()
    .match(/^(?:(\d+):)?(\d+(?:\.\d+)?)$/);
  if (match) {
    return 60 * (match[1] || 0) + parseFloat(match[2]);
  } else {
    return undefined;
  }
};

const getStore = () => {
  let store = null;
  const jsonStore = window.localStorage.getItem("chantrain");
  try {
    store = JSON.parse(jsonStore);
  } catch {
    //
  }
  if (!_isObject(store)) store = {};
  return store;
};

const getTimingFromStore = (chantId) => getStore()[chantId];

const setTimingToStore = (chantId, timing) => {
  const store = getStore();
  store[chantId] = normalizeStoreTiming(timing);
  window.localStorage.setItem("chantrain", JSON.stringify(store));
};

const normalizeTime = (time) => {
  time = parseFloat(time);
  return _isFinite(time) ? (time >= 0 ? time : undefined) : undefined;
};

const normalizeTimeNode = (time) => {
  const start = normalizeTime(time.start);
  let end = normalizeTime(time.end);
  if (isFinite(end) && (!isFinite(start) || start > end)) {
    end = undefined;
  }
  return {
    index: parseInt(time.index),
    start,
    end,
    html: String(time.html),
  };
};

const normalizeStoreTiming = (timing) => ({
  id: timing.id ? String(timing.id) : undefined,
  mediaUrl: timing.mediaUrl ? String(timing.mediaUrl) : undefined,
  times: timing.times.map((time) => {
    time = normalizeTimeNode(time);
    return { start: time.start, end: time.end };
  }),
});

const getTimesFromChant = (chant, savedTimes) => {
  const times = [];
  let index = 0;

  const walkNode = (node) => {
    if (node?.html) {
      times.push(
        normalizeTimeNode({
          index: index++,
          start: node.start,
          end: node.end,
          html: String(node.html),
        })
      );
    } else if (node?.children) {
      node.children?.forEach?.(walkNode);
    }
  };
  walkNode(chant);

  if (Array.isArray(savedTimes)) {
    times.forEach((time, index) => {
      let savedTime = savedTimes[index];
      if (_isObject(savedTime)) {
        savedTime = normalizeTimeNode(savedTime);
        time.start = savedTime.start;
        time.end = savedTime.end;
      }
    });
  }

  return times;
};

const getTimingFromChant = (chant, savedTiming) => {
  const timing = {
    id: String(chant.id),
    mediaUrl: null,
    times: null,
  };
  if (_isObject(savedTiming)) {
    if (savedTiming.mediaUrl) {
      timing.mediaUrl = String(savedTiming.mediaUrl);
    }
    timing.times = getTimesFromChant(chant, savedTiming.times);
  } else {
    timing.times = getTimesFromChant(chant);
  }
  return timing;
};

const getActiveTimes = (times, currentTime) => {
  const activeTimes = {};
  let lastNoEndIndex = null;

  if (!_isFinite(currentTime)) return activeTimes;

  times.forEach((time, index) => {
    const { start, end } = time;
    if (_isFinite(start)) {
      if (lastNoEndIndex !== null) {
        if (currentTime < start) {
          activeTimes[lastNoEndIndex] = true;
        }
        lastNoEndIndex = null;
      }
      if (start <= currentTime) {
        if (_isFinite(end)) {
          if (currentTime < end) {
            activeTimes[index] = true;
          }
        } else {
          lastNoEndIndex = index;
        }
      }
    }
  });

  if (_isFinite(lastNoEndIndex)) activeTimes[lastNoEndIndex] = true;

  return activeTimes;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CLOSE_EDIT_NODE_DIALOG":
      return { ...state, editTime: null };
    case "CLOSE_MEDIA_URL_DIALOG":
      return { ...state, mediaUrlDialog: false };
    case "OPEN_EDIT_NODE_DIALOG":
      return { ...state, editTime: state.timing?.times?.[action.index] };
    case "OPEN_MEDIA_URL_DIALOG":
      return { ...state, mediaUrlDialog: true };
    case "SET_MEDIA_PLAYER":
      return { ...state, mediaPlayer: action.mediaPlayer };
    case "SET_MEDIA_URL": {
      let { timing } = state;
      if (timing) {
        timing = { ...timing, mediaUrl: action.mediaUrl };
      }
      return { ...state, timing };
    }
    case "SET_TIMING":
      return { ...state, timing: action.timing };
    case "SET_VIEW":
      return { ...state, view: action.view };
    case "TOGGLE_VIEW": {
      const view = state.view === "EDIT" ? "STYLED" : "EDIT";
      return { ...state, view };
    }
    case "UPDATE_NODE": {
      let { timing } = state;
      if (timing) {
        timing = { ...timing };
        const time = timing.times[action.index];
        if (time) {
          timing.times[action.index] = normalizeTimeNode({
            ...time,
            start: action.start,
            end: action.end,
          });
        }
        return { ...state, timing };
      } else {
        return state;
      }
    }
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
};

const initializer = ({ chant }) => {
  return {
    chant,
    editTime: null,
    mediaUrlDialog: false,
    timing: null,
    view: "EDIT",
  };
};

const focusNextButton = (button) => {
  const nextButton =
    button?.parentNode?.parentNode?.nextSibling?.children?.[0]?.children?.[0];
  if (nextButton) {
    nextButton.focus();
    nextButton.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
};

const EditTimeDialog = ({ dispatch, state }) => {
  const { editTime } = state;
  const ref = useRef();
  const [start, setStart] = useState(timeToHuman(editTime?.start));
  const [end, setEnd] = useState(timeToHuman(editTime?.end));
  const classes = useStyles();

  const onClose = () => dispatch({ type: "CLOSE_EDIT_NODE_DIALOG" });
  const onSubmit = (event) => {
    event.preventDefault();
    dispatch({
      type: "UPDATE_NODE",
      index: editTime.index,
      start: humanToTime(start),
      end: humanToTime(end),
    });
    dispatch({ type: "CLOSE_EDIT_NODE_DIALOG" });
  };
  const onChangeStart = (event) => setStart(event.target.value);
  const onChangeEnd = (event) => setEnd(event.target.value);

  return (
    <Dialog className={classes.root} onClose={onClose} open={Boolean(editTime)}>
      <form onSubmit={onSubmit} ref={ref}>
        <DialogTitle>Edit Node {editTime?.index}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span
              className="verse"
              dangerouslySetInnerHTML={{ __html: editTime?.html }}
            />
          </DialogContentText>
          <TextField
            autoFocus
            label="Start"
            name="start"
            onChange={onChangeStart}
            value={start}
          />{" "}
          <TextField
            label="End"
            name="end"
            onChange={onChangeEnd}
            value={end}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="primary" onClick={onSubmit} type="submit">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const ChanTrainTable = ({ dispatch, state }) => {
  const [activeTimes, setActiveTimes] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const { mediaPlayer, timing } = state;
      const currentTime = mediaPlayer ? mediaPlayer.currentTime : null;
      let currentActiveTimes;
      if (_isFinite(currentTime)) {
        currentActiveTimes = getActiveTimes(timing.times, currentTime);
      } else {
        currentActiveTimes = {};
      }
      if (!_isEqual(currentActiveTimes, activeTimes)) {
        setActiveTimes(currentActiveTimes);
      }
    }, 50);
    return () => {
      clearInterval(interval);
    };
  }, [activeTimes, state.mediaPlayer, state.timing]);

  const onClick = (event, index) => {
    if (state.mediaPlayer?.paused === false) {
      let start = state.mediaPlayer?.currentTime ?? null;
      if (start !== null) {
        start = parseFloat(start.toFixed(1));
        dispatch({ type: "UPDATE_NODE", index, start, end: undefined });
        focusNextButton(event.target);
      }
    } else {
      dispatch({ type: "OPEN_EDIT_NODE_DIALOG", index });
    }
  };

  return (
    <table size="small">
      <thead>
        <tr>
          <td></td>
          <td>Start</td>
          <td>End</td>
          <td>Verse</td>
        </tr>
      </thead>
      <tbody>
        {state.timing.times.map((time, index) => (
          <tr key={index}>
            <td>
              <button onClick={(event) => onClick(event, index)}>✎</button>
            </td>
            <td>{timeToHuman(time.start)}</td>
            <td>{timeToHuman(time.end)}</td>
            <td>
              <span
                className={"verse" + (activeTimes[index] ? " active" : "")}
                dangerouslySetInnerHTML={{ __html: time.html }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const CopyButton = ({ state }) => {
  const ref = useRef();
  const { snackInfo } = useSnackbar();

  const onClick = () => {
    const el = ref.current;
    el.value =
      JSON.stringify(normalizeStoreTiming(state.timing), null, 2) + "\n";
    el.select();
    el.setSelectionRange(0, 99999); // mobile
    document.execCommand("copy");
    el.value = "";
    el.blur();
    snackInfo("Copied JSON to clipboard");
  };

  return (
    <>
      <textarea
        ref={ref}
        style={{
          width: 1,
          height: "2em",
          verticalAlign: "middle",
          border: "none",
          backgroundColor: "transparent",
          overflow: "hidden",
          resize: "none",
        }}
      />
      <Button onClick={onClick} variant="outlined">
        Copy JSON
      </Button>
    </>
  );
};

const ChanTrainEdit = ({ chant }) => {
  const [state, dispatch] = useReducer(reducer, { chant }, initializer);
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
    if (chant) {
      if (!state.timing || state.timing.id !== chant.id) {
        console.log(`loading ${chant.id}`);
        const existingTiming = getTimingFromStore(chant.id);
        const timing = getTimingFromChant(chant, existingTiming);
        dispatch({ type: "SET_TIMING", timing });
      }
    } else {
      dispatch({ type: "SET_TIMING", timing: null });
    }
    return () => {
      if (_isObject(state.timing)) {
        console.log(`saving ${chant.id}`);
        setTimingToStore(chant.id, state.timing);
      }
    };
  }, [chant, state.timing]);

  useEffect(() => {
    if (state.mediaPlayer && state.timing?.mediaUrl) {
      state.mediaPlayer.src = state.timing.mediaUrl;
    }
  }, [state.mediaPlayer, state.timing?.mediaUrl]);

  const toggleView = () => dispatch({ type: "TOGGLE_VIEW" });
  const openMediaUrlDialog = () => dispatch({ type: "OPEN_MEDIA_URL_DIALOG" });
  const closeMediaUrlDialog = () =>
    dispatch({ type: "CLOSE_MEDIA_URL_DIALOG" });
  const setMedialUrl = (mediaUrl) =>
    dispatch({ type: "SET_MEDIA_URL", mediaUrl });

  return (
    <div className={classes.root}>
      <div className={classes.buttons}>
        <ButtonLink href="/chantrain" variant="outlined">
          Table of Contents
        </ButtonLink>{" "}
        <Button onClick={toggleView} variant="outlined">
          {state.view === "EDIT" ? "Styled" : "Edit"}
        </Button>
        <CopyButton state={state} />
      </div>
      <h1>Chant Training</h1>
      <h2>{`${chant.id} ${chant.title}`}</h2>
      <p>
        <Button
          disabled={!state.timing}
          onClick={openMediaUrlDialog}
          size="small"
          variant="outlined"
        >
          Media URL
        </Button>
        <ChantSetMediaDialog
          onClose={closeMediaUrlDialog}
          onSubmit={setMedialUrl}
          open={state.mediaUrlDialog}
        />{" "}
        {state.timing?.mediaUrl ?? ""}
      </p>
      <audio autoPlay={false} controls ref={mediaPlayerRef} />
      {state.editTime && <EditTimeDialog dispatch={dispatch} state={state} />}
      {state.view === "EDIT" && state.timing && (
        <ChanTrainTable dispatch={dispatch} state={state} />
      )}
      {state.view === "STYLED" && <Chant chant={chant} />}
    </div>
  );
};

const ChanTrainEditPage = () => {
  const router = useRouter();

  const chantId = router.query.id;

  return (
    <PageLayout>
      <Title title="Chant Training" />
      <ChantFontStyle />
      <Container maxWidth="md">
        <ChantLoader>
          {({ chants }) => {
            const chant = chants.chantMap[chantId];
            if (chant) {
              return <ChanTrainEdit chant={chant} />;
            }
          }}
        </ChantLoader>
      </Container>
    </PageLayout>
  );
};

export default ChanTrainEditPage;

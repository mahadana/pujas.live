import { emphasize, makeStyles } from "@material-ui/core/styles";
import _isEqual from "lodash/isEqual";
import _isFinite from "lodash/isFinite";
import { useEffect, useState } from "react";

import {
  getActiveTimes,
  timeToHuman,
} from "@/components/chanting/editor/ChantEditorReducer";

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "Gentium Incantation",
  },
  header: {
    fontWeight: "bold",
  },
  button: {
    backgroundColor: emphasize(theme.palette.background.default, 0.1),
    color: theme.palette.primary.dark,
    border: "none",
    "&:focus": {
      backgroundColor: "rgba(255, 255, 0, 0.5)",
    },
  },
  active: {
    backgroundColor: "rgba(255, 255, 0, 0.3)",
  },
}));

const focusNextButton = (button) => {
  const nextButton =
    button?.parentNode?.parentNode?.nextSibling?.children?.[0]?.children?.[0];
  if (nextButton) {
    nextButton.focus();
  }
};

const ChantEditorTable = ({ dispatch, state }) => {
  const [activeTimes, setActiveTimes] = useState({});
  const classes = useStyles();

  useEffect(() => {
    const interval = setInterval(() => {
      const { mediaPlayer, timing } = state;
      const currentTime = mediaPlayer ? mediaPlayer.currentTime : null;
      let currentActiveTimes;
      if (_isFinite(currentTime) && timing) {
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
      let start = state.mediaPlayer?.currentTime;
      if (_isFinite(start)) {
        start = parseFloat(start.toFixed(1));
        dispatch({ type: "UPDATE_NODE", index, start, end: undefined });
        focusNextButton(event.target);
      }
    } else {
      dispatch({ type: "OPEN_TIME_DIALOG", index });
    }
  };

  return (
    <table>
      <thead>
        <tr className={classes.header}>
          <td></td>
          <td>Start</td>
          <td>End</td>
          <td>Verse</td>
        </tr>
      </thead>
      <tbody>
        {state.timing?.times?.map?.((time, index) => (
          <tr key={index}>
            <td>
              <button
                className={classes.button}
                onClick={(event) => onClick(event, index)}
              >
                ✎
              </button>
            </td>
            <td>{timeToHuman(time.start)}</td>
            <td>{timeToHuman(time.end)}</td>
            <td>
              <span
                className={activeTimes[index] && classes.active}
                dangerouslySetInnerHTML={{ __html: time.html }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ChantEditorTable;

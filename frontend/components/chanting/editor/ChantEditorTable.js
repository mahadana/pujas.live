import { emphasize, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import _isFinite from "lodash/isFinite";
import { useCallback, useEffect, useState } from "react";

import ChantEditorTimeDialog from "@/components/chanting/editor/ChantEditorTimeDialog";
import {
  interpolateTiming,
  normalizeTiming,
  timeToHuman,
} from "@/lib/chanting";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: "1rem",
    borderCollapse: "separate",
    borderSpacing: 0,
    fontSize: "1rem",
    "& th": {
      position: "sticky",
      top: "3rem",
      padding: "0.25rem",
      backgroundColor: theme.palette.background.default,
      borderBottom: `1px solid ${theme.palette.text.disabled}`,
      fontWeight: "bold",
    },
  },
  time: {
    minWidth: "4em",
    textAlign: "center",
    paddingRight: "0.5em",
  },
  button: {
    backgroundColor: emphasize(theme.palette.background.default, 0.1),
    color: theme.palette.primary.main,
    border: "none",
    "&:focus": {
      backgroundColor: "rgba(255, 255, 0, 0.2)",
    },
    "&:hover": {
      backgroundColor: "rgba(255, 255, 0, 0.3)",
    },
  },
  active: {
    backgroundColor: "rgba(255, 255, 0, 0.1)",
  },
  verse: {
    fontFamily: "Gentium Incantation",
  },
}));

const focusNextButton = () => {
  const currentButton = document.activeElement;
  const nextButton =
    currentButton?.parentNode?.parentNode?.nextSibling?.children?.[2]
      ?.children?.[0];
  if (nextButton) {
    nextButton.focus();
  }
};

const ChantEditorTable = ({ dispatch, state }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const classes = useStyles();

  const { mediaPlayer, timing } = state;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!mediaPlayer) return;
      const currentTime = mediaPlayer.currentTime;
      const newActiveIndex = interpolateTiming(
        normalizeTiming(timing)
      ).nodes.findIndex(
        (time) => time.start <= currentTime && currentTime < time.end
      );
      setActiveIndex(newActiveIndex >= 0 ? newActiveIndex : null);
      if (_isFinite(timing?.end) && timing.end <= currentTime)
        mediaPlayer.pause();
    }, 50);
    return () => {
      clearInterval(interval);
    };
  }, [mediaPlayer, timing]);

  const onCloseEdit = useCallback(() => setEditIndex(null), []);
  const onSavedEdit = focusNextButton;
  const onClickEdit = (event, index) => {
    if (mediaPlayer?.paused === false) {
      const start = mediaPlayer?.currentTime;
      if (_isFinite(start)) {
        dispatch({ type: "UPDATE_NODE", index, start, end: null });
        focusNextButton();
      }
    } else {
      setEditIndex(index);
    }
  };

  return (
    <>
      <table className={classes.root}>
        <thead>
          <tr>
            <th className={classes.time}>Start</th>
            <th className={classes.time}>End</th>
            <th></th>
            <th>Verse</th>
          </tr>
        </thead>
        <tbody>
          {timing?.nodes?.map?.((node, index) => (
            <tr key={index}>
              <td className={classes.time}>{timeToHuman(node.start, 1)}</td>
              <td className={classes.time}>{timeToHuman(node.end, 1)}</td>
              <td>
                <button
                  className={classes.button}
                  onClick={(event) => onClickEdit(event, index)}
                >
                  ✎
                </button>
              </td>
              <td>
                <span
                  className={clsx(
                    classes.verse,
                    index === activeIndex && classes.active
                  )}
                  dangerouslySetInnerHTML={{ __html: node.html }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ChantEditorTimeDialog
        dispatch={dispatch}
        index={editIndex}
        onClose={onCloseEdit}
        onSaved={onSavedEdit}
        state={state}
      />
    </>
  );
};

export default ChantEditorTable;

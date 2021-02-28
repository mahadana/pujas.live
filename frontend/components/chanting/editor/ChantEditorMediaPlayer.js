import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import ReplayIcon from "@material-ui/icons/Replay";
import _isFinite from "lodash/isFinite";
import _isNil from "lodash/isNil";
import { memo, useEffect, useRef } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    padding: "0.25rem 0",
    backgroundColor: theme.palette.background.default,
  },
  button: {
    width: "2.5rem",
    height: "2.5rem",
  },
  audio: {
    height: "2.5rem",
    width: "calc(100% - 3rem)",
  },
}));

const ChantEditorMediaPlayer = memo(
  ({ dispatch, state }) => {
    const ref = useRef();
    const classes = useStyles();

    const mediaPlayer = ref.current;
    const { playbackRate, timing } = state;
    const mediaUrl = timing?.mediaUrl;

    useEffect(() => {
      if (state.mediaPlayer !== mediaPlayer) {
        dispatch({ type: "SET_MEDIA_PLAYER", mediaPlayer });
      }
      const metaHandler = () => {
        const duration = mediaPlayer?.duration;
        if (_isNil(timing.end) && _isFinite(duration)) {
          dispatch({ type: "SET_TIMING_END", end: duration });
        }
      };
      mediaPlayer?.addEventListener?.("loadedmetadata", metaHandler);
      return () =>
        mediaPlayer?.removeEventListener?.("loadedmetadata", metaHandler);
    }, [mediaPlayer, timing]);

    useEffect(() => {
      if (mediaPlayer) mediaPlayer.src = mediaUrl;
    }, [mediaPlayer, timing?.mediaUrl]);

    useEffect(() => {
      if (mediaPlayer) mediaPlayer.playbackRate = playbackRate;
    }, [mediaPlayer, playbackRate]);

    const onClick = () => {
      mediaPlayer.currentTime = timing?.start ?? 0;
      mediaPlayer.play();
    };

    return (
      <div className={classes.root}>
        <IconButton className={classes.button} onClick={onClick} size="small">
          <Tooltip title="Restart">
            <ReplayIcon />
          </Tooltip>
        </IconButton>
        <audio autoPlay={false} className={classes.audio} controls ref={ref} />
      </div>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch &&
    prev.state.timing === next.state.timing &&
    prev.state.playbackRate === next.state.playbackRate
);

ChantEditorMediaPlayer.displayName = "ChantEditorMediaPlayer";

export default ChantEditorMediaPlayer;

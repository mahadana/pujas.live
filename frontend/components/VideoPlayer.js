import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";

import CloseButtonLink from "@/components/CloseButtonLink";
import VideoChantingBooksSlider from "@/components/VideoChantingBooksSlider";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: "black",
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "min(8vh, 8vw)",
    transition: "all 0.5s ease",
    "&:hover": {
      color: "white",
      backgroundColor: "rgba(255, 255, 255, 0.5)",
    },
  },
  iframe: {
    width: "100%",
    height: "100%",
  },
}));

const VideoPlayer = ({
  autoplay = false,
  closeProps = {},
  live = false,
  onEnded,
  skip = 0,
  url,
}) => {
  const ref = useRef();
  const [playing, setPlaying] = useState(live ? true : autoplay);
  const [muted, setMuted] = useState(!live);
  const classes = useStyles();

  const onPause = () => setPlaying(false);
  const onPlay = () => setPlaying(true);
  const onStart = () => {
    if (!live) {
      setTimeout(() => {
        ref.current?.seekTo(skip);
        setTimeout(() => setMuted(false), 1);
      }, 1);
    }
  };

  const config = {
    youtube: {},
    vimeo: {},
  };

  return (
    <Box className={classes.root}>
      <CloseButtonLink className={classes.closeButton} {...closeProps} />
      <VideoChantingBooksSlider />
      <ReactPlayer
        config={config}
        controls={true}
        height="100%"
        muted={muted}
        onEnded={onEnded}
        onPause={onPause}
        onPlay={onPlay}
        onStart={onStart}
        playing={playing}
        ref={ref}
        width="100%"
        url={url}
      />
    </Box>
  );
};

export default VideoPlayer;

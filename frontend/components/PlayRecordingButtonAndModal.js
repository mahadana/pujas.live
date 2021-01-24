import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";

import VideoIframeModal from "@/components/VideoIframeModal";
import {
  getYouTubeEmbedVideoUrlFromVideoId,
  getYouTubeVideoIdFromUrl,
} from "@/lib/util";

const useStyles = makeStyles((theme) => ({
  button: {
    borderRadius: 20,
  },
}));

const PlayRecordingButtonAndModal = ({ recording, children }) => {
  const [isOpen, setOpen] = useState(false);
  const classes = useStyles();

  let embed = false;
  let videoUrl = recording.recordingUrl;
  if (recording.embed) {
    const videoId = getYouTubeVideoIdFromUrl(recording.recordingUrl);
    if (videoId) {
      embed = true;
      videoUrl = getYouTubeEmbedVideoUrlFromVideoId(videoId);
    }
  }

  const onClick = () => {
    if (embed) {
      setOpen(true);
    } else {
      window.open(videoUrl, "_blank", "noreferrer");
    }
  };
  const onCloseVideoModal = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        className={classes.button}
        color={recording?.live ? "primary" : undefined}
        onClick={onClick}
        variant="contained"
      >
        {children}
      </Button>
      <VideoIframeModal
        url={videoUrl}
        open={isOpen}
        onClose={onCloseVideoModal}
      />
    </>
  );
};

export default PlayRecordingButtonAndModal;

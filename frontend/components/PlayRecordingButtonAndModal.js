import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";

import VideoIframeModal from "@/components/VideoIframeModal";
import {
  getYouTubeEmbedVideoUrlFromVideoId,
  getYouTubeVideoIdFromUrl,
  getYouTubeVideoUrlFromVideoId,
} from "@/lib/util";

const useStyles = makeStyles((theme) => ({
  button: {
    borderRadius: 20,
  },
}));

const PlayRecordingButtonAndModal = ({ children, recording, skip }) => {
  const [isOpen, setOpen] = useState(false);
  const classes = useStyles();

  let embed = recording.embed;
  let videoUrl = recording.recordingUrl;
  const youTubeVideoId = getYouTubeVideoIdFromUrl(videoUrl);
  if (youTubeVideoId) {
    videoUrl = (embed
      ? getYouTubeEmbedVideoUrlFromVideoId
      : getYouTubeVideoUrlFromVideoId)(youTubeVideoId, {
      autoplay: true,
      skip,
    });
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

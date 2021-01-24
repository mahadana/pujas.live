import VideoIframeModal from "@/components/VideoIframeModal";
import Button from "@material-ui/core/Button";
import {
  getYouTubeEmbedVideoUrlFromVideoId,
  getYouTubeVideoIdFromUrl,
} from "@/lib/util";
import { useState } from "react";

const PlayRecordingButtonAndModal = ({ recording, children }) => {
  const [isOpen, setOpen] = useState(false);

  let videoUrl = recording.recordingUrl;
  if (recording.embed) {
    const videoId = getYouTubeVideoIdFromUrl(recording.recordingUrl);
    if (videoId) {
      videoUrl = getYouTubeEmbedVideoUrlFromVideoId(videoId);
    }
  }

  const onClick = () => {
    if (recording.embed) {
      setOpen(true);
    } else {
      const w = window.open(recording.recordingUrl, "_blank");
      w.focus();
    }
  };
  const onCloseVideoModal = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={onClick}
        color={recording?.live ? "primary" : undefined}
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

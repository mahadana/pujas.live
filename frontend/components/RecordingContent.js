import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Title from "@/components/Title";
import VideoPlayer from "@/components/VideoPlayer";
import { getRecordingPath, getRecordingVideoUrl } from "shared/path";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    height: "100vh",
    width: "100vw",
    backgroundColor: "black",
  },
}));

const RecordingContent = ({ recording }) => {
  const router = useRouter();
  const classes = useStyles();

  const recordingPath = getRecordingPath(recording);
  const videoUrl = getRecordingVideoUrl(recording, {
    autoplay: false,
    skip: router.query.skip,
  });
  const closeProps = { href: "/" };

  useEffect(() => {
    if (typeof window !== "undefined" && !recording.embed) {
      window.location.href = videoUrl;
    } else if (recordingPath !== router.asPath) {
      router.replace(recordingPath, null, {
        shallow: true,
      });
    }
  }, []);

  const onEnded = () => router.push("/");

  return recording.embed ? (
    <Box className={classes.root}>
      <style jsx global>
        {`
          body {
            overflow-y: auto;
          }
        `}
      </style>
      <Title title={`${recording.title} | Recording`} />
      <VideoPlayer
        autoplay={false}
        closeProps={closeProps}
        onEnded={onEnded}
        url={videoUrl}
      />
    </Box>
  ) : null;
};

export default RecordingContent;

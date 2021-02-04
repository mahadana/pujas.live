import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Title from "@/components/Title";
import VideoPlayer from "@/components/VideoPlayer";
import { getRecordingVideoUrl } from "shared/path";

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

  const skip = router.query.skip;
  const videoUrl = getRecordingVideoUrl(recording, {
    autoplay: false,
    skip,
  });
  const closeProps = { href: "/" };

  useEffect(() => {
    if (typeof window !== "undefined" && !recording.embed) {
      window.location.href = videoUrl;
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
      {!!recording.title && <Title title={recording.title} />}
      <VideoPlayer
        autoplay={false}
        closeProps={closeProps}
        live={recording.live}
        onEnded={onEnded}
        skip={skip}
        url={recording.url}
      />
    </Box>
  ) : null;
};

export default RecordingContent;

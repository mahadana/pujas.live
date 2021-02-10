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

  const videoUrl = getRecordingVideoUrl(recording);
  const closeProps = { href: "/" };

  useEffect(() => {
    if (typeof window !== "undefined" && !recording.embed) {
      window.location.href = videoUrl;
    }
  }, []);

  const onEnded = () => router.push("/");

  return (
    <div className={classes.root}>
      <style jsx global>
        {`
          body {
            overflow-y: auto;
          }
        `}
      </style>
      {!!recording.title && <Title title={recording.title} />}
      {recording.embed && (
        <VideoPlayer
          autoplay={false}
          closeProps={closeProps}
          live={recording.live}
          onEnded={onEnded}
          skip={recording.skip}
          url={videoUrl}
        />
      )}
    </div>
  );
};

export default RecordingContent;

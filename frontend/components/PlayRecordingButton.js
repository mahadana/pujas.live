import { makeStyles } from "@material-ui/core/styles";

import ButtonLink from "@/components/ButtonLink";
import { useVideoModalHref } from "@/components/VideoModal";
import { getRecordingPath, getRecordingVideoUrl } from "@/lib/util";

const useStyles = makeStyles((theme) => ({
  button: {
    borderRadius: 20,
  },
}));

const PlayRecordingButton = ({ active, children, recording, skip, title }) => {
  const getVideoModalHref = useVideoModalHref();
  const classes = useStyles();

  const props = {};
  const options = { autoplay: true, skip };
  const recordingPath = getRecordingPath(recording, options);
  const videoUrl = getRecordingVideoUrl(recording, options);

  if (recording.embed) {
    props.as = recordingPath;
    props.href = getVideoModalHref({
      title: title || recording.title,
      url: videoUrl,
    });
    props.scroll = false;
    props.shallow = true;
  } else {
    props.href = videoUrl;
    props.rel = "noopener noreferrer";
    props.target = "_blank";
  }

  return (
    <ButtonLink
      className={classes.button}
      color={active ? "primary" : undefined}
      variant="contained"
      {...props}
    >
      {children}
    </ButtonLink>
  );
};

export default PlayRecordingButton;

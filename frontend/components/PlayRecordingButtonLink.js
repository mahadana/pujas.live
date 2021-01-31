import { makeStyles } from "@material-ui/core/styles";
import Image from "next/image";

import ButtonLink from "@/components/ButtonLink";
import { useVideoModalHref } from "@/components/VideoModal";
import { getRecordingPath, getRecordingVideoUrl } from "@/lib/util";
import plausible from "@/lib/plausible";

const useStyles = makeStyles((theme) => ({
  button: {
    borderRadius: 20,
    paddingLeft: "1em",
    paddingRight: "1em",
    width: "11em",
  },
  externalLink: {
    paddingLeft: ".5em",
    "& > div": {
      verticalAlign: "text-bottom",
    },
  },
}));

const PlayRecordingButtonLink = ({
  active,
  children,
  recording,
  skip,
  title,
}) => {
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
    props.onClick = () => {
      plausible("externalVideo", { props: { url: videoUrl } });
    };
  }

  const externalLink = (
    <span className={classes.externalLink}>
      <Image src="/external-link.svg" width="16" height="16" />
    </span>
  );

  return (
    <ButtonLink
      className={classes.button}
      color={active ? "primary" : undefined}
      variant="contained"
      {...props}
    >
      {children}
      {!recording.embed && externalLink}
    </ButtonLink>
  );
};

export default PlayRecordingButtonLink;

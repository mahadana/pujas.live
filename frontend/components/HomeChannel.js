import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { useState } from "react";

import Upcoming from "@/components/Upcoming";
import VideoIframeModal from "@/components/VideoIframeModal";
import {
  getYouTubeVideoIdFromUrl,
  getYouTubeEmbedVideoUrlFromVideoId,
} from "@/lib/util";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    padding: "1.5em",
    "&:nth-child(odd)": {
      backgroundColor: "#eee",
    },
  },
  image: {
    flex: "0 0 12em",
    "& > img": {
      display: "block",
      objectFit: "cover",
      width: "10em",
      height: "10em",
    },
  },
  text: {
    flex: "1 1 20em",
    marginRight: "2em",
    "& > h3": {
      margin: 0,
      fontSize: "1.5em",
      fontWeight: 400,
    },
    "& > p": {
      marginBottom: 0,
      fontSize: "1.1em",
    },
  },
  monasteryLinks: {
    "& > a": {
      marginRight: "1em",
    },
  },
  links: {
    display: "flex",
    alignItems: "center",
    "& button": {
      borderRadius: 20,
    },
  },
}));

const HomeChannel = (props) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const classes = useStyles();
  const imageUrl = props.image
    ? `${process.env.NEXT_PUBLIC_API_URL}${props.image?.formats?.thumbnail?.url}`
    : "https://placekitten.com/g/150/150";

  const onLivestreamClick = (event) => {
    event.preventDefault();
    if (props.activeStream.embed) {
      const videoId = getYouTubeVideoIdFromUrl(props.activeStream.recordingUrl);
      if (videoId) {
        const embedUrl = getYouTubeEmbedVideoUrlFromVideoId(videoId);
        setVideoUrl(embedUrl);
      } else {
        // TODO error notification?
      }
    } else {
      const w = window.open(props.activeStream.recordingUrl, "_blank");
      w.focus();
    }
  };

  const onCloseVideoModal = () => {
    setVideoUrl(null);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.image}>
        <img src={imageUrl} />
      </Box>
      <Box className={classes.text}>
        <h3>{props.title}</h3>
        {props.activeStream?.startAt && (
          <Typography variant="subtitle2">
            <Upcoming
              time={props.activeStream.startAt}
              duration={props.activeStream.duration}
            />
          </Typography>
        )}
        <p>{props.description}</p>
        <p className={classes.monasteryLinks}>
          {props.monastery && props.monastery.websiteUrl && (
            <a href={props.monastery.websiteUrl} target="_blank">
              {props.monastery.title} Website
            </a>
          )}
          {props.channelUrl && (
            <a href={props.channelUrl} target="_blank">
              {props.monastery?.title || "Livestream"} Channel
            </a>
          )}
          {props.historyUrl && (
            <a href={props.historyUrl} target="_blank">
              Previous Sessions
            </a>
          )}
        </p>
      </Box>
      <Box className={classes.links}>
        {props.activeStream && (
          <>
            <Button
              color={props.activeStream?.live ? "primary" : undefined}
              variant="contained"
              onClick={onLivestreamClick}
            >
              {props.activeStream?.live ? "Join Livestream" : "Livestream"}
            </Button>
            <VideoIframeModal
              url={videoUrl}
              open={!!videoUrl}
              onClose={onCloseVideoModal}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default HomeChannel;

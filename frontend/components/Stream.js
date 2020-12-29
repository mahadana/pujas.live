import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { useState } from "react";

import Upcoming from "./Upcoming";
import VideoIframeModal from "./VideoIframeModal";
import { dayjs } from "@/lib/time";
import { getChannelIdFromChannelUrl } from "@/lib/util";

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

const Stream = (props) => {
  const classes = useStyles();
  const imageUrl = props.image
    ? `${process.env.NEXT_PUBLIC_API_URL}${props.image?.formats?.thumbnail?.url}`
    : "https://placekitten.com/g/150/150";

  const formatDate = (ds) => {
    return new Date(ds).toLocaleString();
  };

  const [open, setOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  const openVideo = (event, url) => {
    event.preventDefault();
    setVideoUrl(url);
    setOpen(true);
  };

  const onCloseVideoModal = () => {
    setOpen(false);
  };

  const live = ((startAt, duration) => {
    const min = dayjs(startAt).utc().subtract(15, "minute");
    const max = dayjs(startAt).utc().add(duration, "minute");
    const now = dayjs().utc();
    return min.isBefore(now) && now.isBefore(max);
  })(props.startAt, props.duration || 240);

  return (
    <Box className={classes.root}>
      <Box className={classes.image}>
        <img src={imageUrl} />
      </Box>
      <Box className={classes.text}>
        <h3>{props.name}</h3>
        {props.streamUrl && props.startAt && (
          <Typography variant="subtitle2">
            <Upcoming time={props.startAt} duration={props.duration} />
          </Typography>
        )}
        <p>{props.description}</p>
        <p className={classes.monasteryLinks}>
          {props.monastery && props.monastery.websiteUrl && (
            <a href={props.monastery.websiteUrl} target="_blank">
              {props.monastery.name} Website
            </a>
          )}
          {props.monastery && props.monastery.channelUrl && (
            <a href={props.monastery.channelUrl} target="_blank">
              {props.monastery.name} Channel
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
        {props.streamUrl && (
          <>
            <Button
              color={live ? "primary" : undefined}
              variant="contained"
              onClick={(event) => {
                if (props.embeddable) {
                  const channelId = getChannelIdFromChannelUrl(
                    props.monastery.channelUrl
                  );
                  openVideo(
                    event,
                    "https://www.youtube.com/embed/live_stream?channel=" +
                      channelId
                  );
                } else {
                  event.preventDefault();
                  const w = window.open(props.streamUrl, "_blank");
                  w.focus();
                }
              }}
            >
              {live ? "Join Livestream" : "Livestream Page"}
            </Button>
            <VideoIframeModal
              url={videoUrl}
              open={open}
              onClose={onCloseVideoModal}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default Stream;

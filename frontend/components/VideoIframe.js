import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

import CloseButtonLink from "@/components/CloseButtonLink";
import VideoChantingBooksSlider from "@/components/VideoChantingBooksSlider";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: "black",
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "min(8vh, 8vw)",
    transition: "all 0.5s ease",
    "&:hover": {
      color: "white",
      backgroundColor: "rgba(255, 255, 255, 0.5)",
    },
  },
  iframe: {
    width: "100%",
    height: "100%",
  },
}));

const VideoIframe = ({ closeButtonProps = {}, url }) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <CloseButtonLink className={classes.closeButton} {...closeButtonProps} />
      <VideoChantingBooksSlider />
      <iframe
        allow="autoplay"
        allowFullScreen
        className={classes.iframe}
        frameBorder="0"
        scrolling="no"
        seamless
        src={url}
      />
    </Box>
  );
};

export default VideoIframe;

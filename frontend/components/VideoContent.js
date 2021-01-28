import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

import VideoIframe from "@/components/VideoIframe";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    height: "100vh",
    width: "100vw",
    backgroundColor: "black",
  },
}));

const VideoContent = ({ url }) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <VideoIframe closeButtonProps={{ href: "/" }} url={url} />
    </Box>
  );
};

export default VideoContent;

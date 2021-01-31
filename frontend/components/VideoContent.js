import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";

import VideoPlayer from "@/components/VideoPlayer";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    height: "100vh",
    width: "100vw",
    backgroundColor: "black",
  },
}));

const VideoContent = ({ url }) => {
  const router = useRouter();
  const classes = useStyles();

  const closeProps = { href: "/" };
  const onEnded = () => router.push("/");

  return (
    <Box className={classes.root}>
      <VideoPlayer
        autoplay={false}
        closeProps={closeProps}
        onEnded={onEnded}
        url={url}
      />
    </Box>
  );
};

export default VideoContent;

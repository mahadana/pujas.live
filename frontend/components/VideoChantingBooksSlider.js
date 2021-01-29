import Box from "@material-ui/core/Box";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useRef, useState } from "react";

import VideoChantingBooksBar from "@/components/VideoChantingBooksBar";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    width: "20vh",
    top: "50%",
    marginTop: "-30vh",
    height: "60vh",
  },
}));

const VideoChantingBooksSlider = () => {
  const timeout = useRef(null);
  const [showing, setShowing] = useState(true);
  const classes = useStyles();

  const resetTimeout = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  };

  /**
    The first time we load the page, show the controls, and then have them move
    out. This lets the user know that the controls are there, just hiding on the
    left.
   */
  useEffect(() => {
    resetTimeout();
    timeout.current = setTimeout(() => setShowing(false), 2000);
    return () => resetTimeout();
  }, []);

  /**
   * Show/hide books based on entering/leaving the fake/invisible element (which
   * is exactly the same size)
   */
  const onMouseEnter = () => {
    resetTimeout();
    if (!showing) {
      setShowing(true);
    }
  };

  const onMouseLeave = () => {
    resetTimeout();
    timeout.current = setTimeout(() => setShowing(false), 500);
  };

  const onCloseChantingBook = () => setShowing(false);

  return (
    <Box
      className={classes.root}
      onMouseEnter={onMouseEnter}
      onMouseOver={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Slide
        direction="right"
        in={showing}
        mountOnEnter
        timeout={400}
        unmountOnExit
      >
        <VideoChantingBooksBar onClose={onCloseChantingBook} />
      </Slide>
    </Box>
  );
};

export default VideoChantingBooksSlider;

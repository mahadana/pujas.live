import Box from "@material-ui/core/Box";
import Fade from "@material-ui/core/Fade";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Slide from "@material-ui/core/Slide";
import CancelIcon from "@material-ui/icons/Cancel";
import { useState, createRef } from "react";

import VideoChantingBooksBar from "@/components/VideoChantingBookBar";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    height: "100%",
    //maxWidth: "70em",
    position: "absolute",
    backgroundColor: "black",
    "& > iframe": {
      width: "100%",
      height: "100%",
      overflow: "hidden",
    },
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  chantingBooks: {
    color: "white",
    position: "absolute",

    width: "106px",
    height: "100%",
  },
  closeIcon: {
    fontSize: 40,
    color: "white",
  },
  hidden: {
    display: "none",
  },
}));

const VideoIframeModal = ({ url, open, onClose }) => {
  const classes = useStyles();
  let timeout;

  const [showing, setShowing] = useState(true);
  const [hasEnteredOnce, setHasEnteredOnce] = useState(false);

  /**
    The first time we load the page, show the controls, and then have them move out.
    This lets the user know that the controls are there, just hiding on the left.
   */
  const onBooksEntered = () => {
    if (!hasEnteredOnce) {
      setTimeout(() => setShowing(false), 1000);
    }
    setHasEnteredOnce(true);
  };

  /**
   * Show/hide books based on entering/leaving the fake/invisible element (which is exactly the same size)
   *
   */
  const onMouseEnterBooks = () => {
    if (timeout) clearTimeout(timeout);
    setShowing(true);
  };

  const onMouseLeaveBooks = () => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => setShowing(false), 500);
  };

  const onCloseChantingBook = () => {
    setShowing(false);
  };

  const onClickClose = () => {
    //reset to initial state
    setHasEnteredOnce(false);
    setShowing(true);

    onClose(); //callback from parent
  };

  const videoChantingRef = createRef();

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      className={classes.modal}
    >
      <Fade in={open}>
        <Box className={classes.container}>
          <IconButton className={classes.closeButton} onClick={onClickClose}>
            <CancelIcon className={classes.closeIcon} />
          </IconButton>
          <Box
            className={classes.chantingBooks}
            onMouseEnter={onMouseEnterBooks}
            onMouseLeave={onMouseLeaveBooks}
          >
            <Slide
              direction="right"
              in={showing}
              mountOnEnter
              unmountOnExit
              onEntered={onBooksEntered}
            >
              <VideoChantingBooksBar
                ref={videoChantingRef}
                onClose={onCloseChantingBook}
              />
            </Slide>
          </Box>

          <iframe
            src={url}
            seamless="seamless"
            scrolling="no"
            frameBorder="0"
            allowtransparency="true"
          />
        </Box>
      </Fade>
    </Modal>
  );
};

export default VideoIframeModal;

import {
  Box,
  Fade,
  IconButton,
  makeStyles,
  Modal,
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import VideoChantingBooksBar from "./VideoChantingBookBar";
import Slide from '@material-ui/core/Slide';
import { useState, forwardRef, createRef } from "react";


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
    fontSize: 40,
    color: "white",
    position: "absolute",
    top: 20,
    left: 20,
  },
  closeIcon: {
    fontSize: 40,
    color: "white",
  },
  hidden: {
    display:"none",
  },
}));

const VideoIframeModal = ({ url, open, onClose }) => {
  const classes = useStyles();

  const [showing, setShowing] = useState(true);
  const [hasEnteredOnce, setHasEnteredOnce] = useState(false);

  /**
    The first time we load the page, show the controls, and then have them move out.
    This lets the user know that the controls are there, just hiding on the left.
   */
  const onBooksEntered = (event) => {
    if(!hasEnteredOnce) {
      setTimeout(() => setShowing(false), 1000)
    }
    setHasEnteredOnce(true);
  }

  /**
   * Show/hide books based on entering/leaving the fake/invisible element (which is exactly the same size)
   *
   */
  const onMouseEnterBooks = (event) => {
    console.log("mouse enter books")
    setShowing(true);
  }

  const onMouseLeaveBooks = (event) => {
    console.log("mouse leave books")
    setTimeout(() => setShowing(false), 500);
  }

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
          <IconButton className={classes.closeButton} onClick={onClose}>
            <CancelIcon className={classes.closeIcon} />
          </IconButton>
          <Slide direction="right" in={showing} mountOnEnter unmountOnExit onEntered={onBooksEntered}>
            <VideoChantingBooksBar ref={videoChantingRef} />
          </Slide>
          {/*this is an invisible version of the bar that stays in place for the actual events*/}
          <VideoChantingBooksBar hidden={true} />
                                 onMouseEnter={onMouseEnterBooks} onMouseLeave={onMouseLeaveBooks}/>
          <iframe
            src={url}
            seamless="seamless"
            scrolling="no"
            frameborder="0"
            allowtransparency="true"
          />
        </Box>
      </Fade>
    </Modal>
  );
};

export default VideoIframeModal;

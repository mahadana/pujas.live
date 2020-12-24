import {
  Box,
  Fade,
  IconButton,
  makeStyles,
  Modal,
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";

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
  closeIcon: {
    fontSize: 40,
    color: "white",
  },
}));

const VideoIframeModal = ({ url, open, onClose }) => {
  const classes = useStyles();

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

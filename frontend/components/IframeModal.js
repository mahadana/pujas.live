import {
  Box,
  Fade,
  IconButton,
  makeStyles,
  Modal,
  withTheme,
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: "calc(100vw - 6em)",
    height: "calc(100vh - 6em)",
    maxWidth: "70em",
    position: "absolute",
    backgroundColor: "white",
    "& > iframe": {
      width: "100%",
      height: "100%",
      overflow: "hidden",
    },
  },
  closeButton: {
    position: "absolute",
    top: 6,
    right: -10,
  },
  closeIcon: {
    fontSize: 40,
    color: "black",
  },
}));

const IframeModal = ({ url, open, onClose }) => {
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
            frameBorder="0"
            allowtransparency="true"
          />
        </Box>
      </Fade>
    </Modal>
  );
};

export default IframeModal;

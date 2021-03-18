import Box from "@material-ui/core/Box";
import Fade from "@material-ui/core/Fade";
import IconButton from "@material-ui/core/IconButton";
import Modal from "@material-ui/core/Modal";
import NoSsr from "@material-ui/core/NoSsr";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import { createContext, useContext, useState } from "react";
import { useRouter } from "next/router";

import ChantModal from "@/components/chanting/ChantModal";
import { hasChantDataUrl } from "@/components/chanting/ChantDataUrlContent";

export const ChantingBooksModalContext = createContext({
  newModal: false,
  open: false,
  parentFullScreen: false,
  setState: () => undefined,
});

export const useChantingBooksModal = () =>
  useContext(ChantingBooksModalContext);

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: `${theme.zIndex.modal + 2} !important`,
  },
  container: {
    position: "relative",
    width: "calc(100% - 6em)",
    height: "calc(100% - 6em)",
    maxWidth: "70em",
    backgroundColor: "white",
  },
  closeButton: {
    position: "absolute",
    top: "-2.1em",
    right: "-2.1em",
    color: "rgba(255, 255, 255, 0.9)",
  },
  closeIcon: {
    fontSize: 45,
  },
  iframe: {
    width: "100%",
    height: "100%",
  },
}));

const OldChantModal = ({ onClose, open, state }) => {
  const classes = useStyles();

  const url = open
    ? `https://pujas.live/chanting/iframe.html?book=${state?.book}`
    : null;

  return (
    <Modal
      className={classes.modal}
      closeAfterTransition
      onClose={onClose}
      open={open}
    >
      <Fade in={open}>
        <Box className={classes.container}>
          <IconButton className={classes.closeButton} onClick={onClose}>
            <CancelIcon className={classes.closeIcon} />
          </IconButton>
          <iframe
            className={classes.iframe}
            src={url}
            frameBorder="0"
            scrolling="no"
            seamless="seamless"
          />
        </Box>
      </Fade>
    </Modal>
  );
};

const ChantingBooksModal = ({ children }) => {
  const router = useRouter();
  const [state, setState] = useState(true);

  const open = !!state?.book;
  const context = {
    open,
    setState: (newState) => {
      setState({
        ...newState,
        newModal: hasChantDataUrl(),
        parentFullScreen: router.pathname !== "/",
      });
    },
  };

  const onClose = () => {
    state?.onClose?.();
    setState(null);
  };

  return (
    <>
      <ChantingBooksModalContext.Provider value={context}>
        {children}
      </ChantingBooksModalContext.Provider>
      <NoSsr>
        {state?.newModal ?? true ? (
          <ChantModal
            onClose={onClose}
            open={open}
            parentFullScreen={state?.parentFullScreen ?? true}
          />
        ) : (
          <OldChantModal onClose={onClose} open={open} state={state} />
        )}
      </NoSsr>
    </>
  );
};

export default ChantingBooksModal;

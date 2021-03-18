import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import dynamic from "next/dynamic";

import ChantLoader from "@/components/chanting/ChantLoader";

const useStyles = makeStyles((theme) => ({
  modal: {
    zIndex: `${theme.zIndex.modal + 2} !important`,
  },
}));

const ChantWindow = dynamic(() => import("@/components/chanting/ChantWindow"));

const ChantModal = ({ open, ...props }) => {
  const classes = useStyles();
  return (
    <Modal
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 250 }}
      className={classes.modal}
      closeAfterTransition
      onClose={props.onClose}
      open={open}
    >
      <Fade in={open} mountOnEnter unmountOnExit>
        <div>
          <ChantLoader>
            {(chantData) => <ChantWindow {...props} chantData={chantData} />}
          </ChantLoader>
        </div>
      </Fade>
    </Modal>
  );
};

export default ChantModal;

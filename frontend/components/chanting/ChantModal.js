import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";

import ChantFontStyle from "@/components/chanting/ChantFontStyle";
import ChantLoader from "@/components/chanting/ChantLoader";
import ChantWindow from "@/components/chanting/ChantWindow";

const useStyles = makeStyles((theme) => ({
  modal: {
    zIndex: `${theme.zIndex.modal + 2} !important`,
  },
}));

const ChantModal = ({ open, ...props }) => {
  const classes = useStyles();
  return (
    <Modal
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
      className={classes.modal}
      closeAfterTransition
      onClose={props.onClose}
      open={open}
    >
      <Fade in={open} mountOnEnter timeout={500} unmountOnExit>
        <div>
          <ChantFontStyle />
          {props.chantData ? (
            <ChantWindow {...props} />
          ) : (
            <ChantLoader>
              {(chantData) => <ChantWindow {...props} chantData={chantData} />}
            </ChantLoader>
          )}
        </div>
      </Fade>
    </Modal>
  );
};

export default ChantModal;

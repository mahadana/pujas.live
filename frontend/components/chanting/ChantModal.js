import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";

import ChantLoader from "@/components/chanting/ChantLoader";

const ChantModal = ({ children, onClose, open }) => (
  <ChantLoader>
    {({ chantData, mobile }) => (
      <Modal open={open} onClose={onClose} closeAfterTransition>
        <Fade in={open}>
          <div>{children({ chantData, mobile })}</div>
        </Fade>
      </Modal>
    )}
  </ChantLoader>
);

export default ChantModal;

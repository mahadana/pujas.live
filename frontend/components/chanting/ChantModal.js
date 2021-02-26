import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";

import ChantLoader from "@/components/chanting/ChantLoader";

const ChantModal = ({ children, onClose, open }) => (
  <Modal open={open} onClose={onClose} closeAfterTransition>
    <Fade in={open}>
      <div>
        <ChantLoader>{children}</ChantLoader>
      </div>
    </Fade>
  </Modal>
);

export default ChantModal;

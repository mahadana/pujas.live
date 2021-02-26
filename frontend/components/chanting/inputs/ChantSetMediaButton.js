import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import HearingIcon from "@material-ui/icons/Hearing";
import { memo, useState } from "react";

import ChantSetMediaDialog from "@/components/chanting/inputs/ChantSetMediaDialog";

const ChantSetMediaButton = memo(
  ({ dispatch, state }) => {
    const [open, setOpen] = useState(false);

    const onClick = () => {
      if (state.mediaUrl) {
        dispatch({ type: "SET_MEDIA_URL", mediaUrl: null });
      } else {
        setOpen(true);
      }
    };
    const onClose = () => setOpen(false);
    const onSubmit = (mediaUrl) =>
      dispatch({ type: "SET_MEDIA_URL", mediaUrl });

    return (
      <>
        <IconButton onClick={onClick}>
          <Tooltip title="Set Media URL">
            <HearingIcon
              color={state.mediaUrl ? "primary" : "disabled"}
              fontSize="large"
            />
          </Tooltip>
        </IconButton>
        <ChantSetMediaDialog
          fullScreen={state.mobile}
          onClose={onClose}
          onSubmit={onSubmit}
          open={open}
        />
      </>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch &&
    prev.state.mediaUrl === next.state.mediaUrl &&
    prev.state.mobile === next.state.mobile
);

ChantSetMediaButton.displayName = "ChantSetMediaButton";

export default ChantSetMediaButton;

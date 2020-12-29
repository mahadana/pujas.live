import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { SnackbarProvider as ParentSnackbarProvider } from "notistack";
import { useRef } from "react";

const SnackbarProvider = (props) => {
  const ref = useRef();
  const action = (key) => (
    <IconButton
      aria-label="close"
      onClick={() => ref.current.closeSnackbar(key)}
      size="small"
      style={{ minWidth: 0 }}
    >
      <CloseIcon />
    </IconButton>
  );
  return (
    <ParentSnackbarProvider
      ref={ref}
      action={action}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      {...props}
    />
  );
};

export default SnackbarProvider;

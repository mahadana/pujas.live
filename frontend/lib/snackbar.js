import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import {
  SnackbarProvider as ParentSnackbarProvider,
  useSnackbar as parentUseSnackbar,
} from "notistack";
import { useRef } from "react";

export const useStyles = makeStyles((theme) => ({
  icon: {
    minWidth: 0,
  },
}));

export const SnackbarProvider = (props) => {
  const classes = useStyles();
  const ref = useRef();
  const close = (key) => {
    ref.current.closeSnackbar(key);
  };
  const action = (key) => (
    <IconButton
      aria-label="close"
      size="small"
      className={classes.icon}
      onClick={() => close(key)}
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

export const useSnackbar = () => {
  const context = parentUseSnackbar();
  const e = (variant) => (message, opts = {}) => {
    context.enqueueSnackbar(message, { ...opts, variant });
  };
  return {
    ...context,
    snackError: e("error"),
    snackInfo: e("info"),
    snackSuccess: e("success"),
    snackWarning: e("warning"),
  };
};

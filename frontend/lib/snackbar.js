import { useSnackbar as parentUseSnackbar } from "notistack";

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

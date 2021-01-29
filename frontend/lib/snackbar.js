import { useSnackbar as parentUseSnackbar } from "notistack";
import { translateStrapiError } from "@/lib/util";

export const useSnackbar = () => {
  const context = parentUseSnackbar();
  const snack = (variant, message, options = {}) => {
    context.enqueueSnackbar(message, { ...options, variant });
  };
  return {
    ...context,
    snack,
    snackException: (error, options) => {
      const message = translateStrapiError(error);
      snack("error", message, options);
      console.error(error);
    },
    snackError: (message, options) => snack("error", message, options),
    snackInfo: (message, options) => snack("info", message, options),
    snackSuccess: (message, options) => snack("success", message, options),
    snackWarning: (message, options) => snack("warning", message, options),
  };
};

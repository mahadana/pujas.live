import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import SaveIcon from "@material-ui/icons/Save";
import { FastField, useFormikContext } from "formik";
import { useEffect, useState } from "react";

import { useSnackbar } from "./snackbar";

export const FormHelper = ({
  focusOnError = true,
  invalidFormSnackbar,
  onSubmitValidationError,
}) => {
  const formik = useFormikContext();
  const { enqueueSnackbar } = useSnackbar();
  const { isSubmitting, isValid, submitCount } = formik;
  const [prevSubmitCount, setPrevSubmitCount] = useState(0);

  useEffect(() => {
    if (submitCount == 0) {
      const el = document.querySelector(`[autofocus]`);
      if (el) {
        el.focus();
      }
    }
  }, [submitCount]);

  useEffect(() => {
    if (!isSubmitting && submitCount > prevSubmitCount) {
      setPrevSubmitCount(submitCount);
      if (!isValid) {
        if (onSubmitValidationError) {
          onSubmitValidationError(formik);
        }
        if (invalidFormSnackbar) {
          enqueueSnackbar(invalidFormSnackbar, {
            variant: "error",
            preventDuplicate: true,
          });
        }
        if (focusOnError) {
          // HACK: this is specific to Material-UI
          const el = document.querySelector(`[aria-invalid="true"]`);
          if (el) {
            el.focus();
          }
        }
      }
    }
  }, [isSubmitting, isValid, submitCount]);

  return null;
};

export const FormTextField = ({ name, ...props }) => (
  <FastField name={name}>
    {({ field, meta }) => (
      <TextField
        error={meta.error && meta.touched}
        helperText={meta.touched && meta.error}
        {...field}
        {...props}
      />
    )}
  </FastField>
);

export const SubmitButton = ({
  children,
  disabled,
  onClick,
  startIcon,
  ...props
}) => {
  const formik = useFormikContext();
  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      disabled={disabled || formik.isSubmitting}
      onClick={
        onClick ||
        ((event) => {
          event.preventDefault();
          formik.submitForm();
        })
      }
      startIcon={startIcon || <SaveIcon />}
      {...props}
    >
      {children}
    </Button>
  );
};

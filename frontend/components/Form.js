import { Form as FormikForm, Formik } from "formik";
import { useEffect, useState } from "react";

import { useSnackbar } from "@/lib/snackbar";

const Form = ({
  children,
  focusOnError = true,
  formProps,
  invalidFormSnackbar,
  ...formikProps
}) => (
  <Formik {...formikProps}>
    {({ isSubmitting, isValid, submitCount }) => {
      const { enqueueSnackbar } = useSnackbar();
      const [prevSubmitCount, setPrevSubmitCount] = useState(0);

      useEffect(() => {
        if (submitCount == 0) {
          const el = document.querySelector(`[autofocus]`);
          if (el) {
            el.focus();
            el.select();
          }
        }
      }, [submitCount]);

      useEffect(() => {
        if (!isSubmitting && submitCount > prevSubmitCount) {
          setPrevSubmitCount(submitCount);
          if (!isValid) {
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

      return <FormikForm {...formProps}>{children}</FormikForm>;
    }}
  </Formik>
);

export default Form;

import TextField from "@material-ui/core/TextField";
import { FastField } from "formik";

const FormTextField = ({ disabled, name, ...props }) => (
  <FastField name={name}>
    {({ field, form: { isSubmitting }, meta }) => (
      <TextField
        disabled={isSubmitting || disabled}
        error={meta.error && meta.touched}
        helperText={meta.touched && meta.error}
        variant="outlined"
        {...field}
        {...props}
      />
    )}
  </FastField>
);

export default FormTextField;

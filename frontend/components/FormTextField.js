import TextField from "@material-ui/core/TextField";
import { FastField } from "formik";

const FormTextField = ({ name, ...props }) => (
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

export default FormTextField;

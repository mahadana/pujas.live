import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useFormikContext } from "formik";

import { TIMEZONES } from "@/lib/time";

const TimeZoneField = ({
  autocompleteProps = {},
  disabled,
  name,
  ...props
}) => {
  const formik = useFormikContext();
  const meta = formik.getFieldMeta(name);

  const onChange = async (_, value) => {
    await formik.setFieldValue(name, value);
    await formik.setFieldTouched(name);
    await formik.validateField(name);
  };

  return (
    <Autocomplete
      disabled={formik.isSubmitting || disabled}
      onChange={onChange}
      options={TIMEZONES}
      renderInput={(params) => (
        <TextField
          disabled={formik.isSubmitting || disabled}
          error={meta.error && meta.touched}
          helperText={meta.touched && meta.error}
          name={name}
          variant="outlined"
          {...params}
          {...props}
        />
      )}
      value={meta.value}
      {...autocompleteProps}
    />
  );
};

export default TimeZoneField;

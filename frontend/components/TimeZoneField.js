import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useFormikContext } from "formik";

import { TIMEZONES } from "@/lib/time";

const TimeZoneField = ({ name, autocompleteProps = {}, ...props }) => {
  const formik = useFormikContext();
  const meta = formik.getFieldMeta(name);
  return (
    <Autocomplete
      {...autocompleteProps}
      options={TIMEZONES}
      value={meta.value}
      onChange={async (_, value) => {
        await formik.setFieldValue(name, value);
        await formik.setFieldTouched(name);
        await formik.validateField(name);
      }}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            {...props}
            error={meta.error && meta.touched}
            helperText={meta.touched && meta.error}
            name={name}
          />
        );
      }}
    />
  );
};

export default TimeZoneField;

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { FieldArray, Form, Formik } from "formik";

import GroupEventFormFragment from "./GroupEventFormFragment";
import { FormHelper, FormTextField, SubmitButton } from "../lib/form";
import { groupSchema } from "../lib/validation";

const EVENT_DEFAULTS = {
  startAt: "12:00",
  duration: "60",
  daysOfWeek: "everyday",
};

const useStyles = makeStyles((theme) => ({
  submitRow: {
    marginTop: "2em",
  },
}));

const GroupForm = ({ group, onSubmit }) => {
  const classes = useStyles();
  return (
    <Formik
      initialValues={group}
      validationSchema={groupSchema}
      validateOnChange={false}
      onSubmit={async (values) => onSubmit(values)}
    >
      <Form>
        <FormHelper invalidFormSnackbar="Please correct the errors." />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5">Group</Typography>
          </Grid>
          <Grid item xs={12} sm={9}>
            <FormTextField
              name="name"
              label="Name"
              required
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormTextField
              name="timezone"
              label="Time Zone"
              required
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <FormTextField
              name="description"
              label="Description"
              multiline
              fullWidth
              rowsMax="8"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5">Events</Typography>
          </Grid>
          <Grid item xs={12}>
            <FieldArray name="events">
              {({ form, push, remove }) => (
                <>
                  {(form.values?.events || []).map((event, index) => (
                    <GroupEventFormFragment
                      key={index}
                      namePrefix={`events.${index}`}
                      onRemove={() => remove(index)}
                    />
                  ))}
                  <Button
                    variant="contained"
                    onClick={() => push({ ...EVENT_DEFAULTS })}
                  >
                    Add Event
                  </Button>
                </>
              )}
            </FieldArray>
          </Grid>
          <Grid item xs={12} className={classes.submitRow}>
            <SubmitButton>{group?.id ? "Update" : "Create"} Group</SubmitButton>
          </Grid>
        </Grid>
      </Form>
    </Formik>
  );
};

export default GroupForm;

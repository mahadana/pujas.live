import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { FieldArray } from "formik";

import Form from "@/components/Form";
import FormTextField from "@/components/FormTextField";
import FormSubmitButton from "@/components/FormSubmitButton";
import GroupEventFormFragment from "@/components//GroupEventFormFragment";
import TimeZoneField from "@/components/TimeZoneField";
import UploadImageField from "@/components/UploadImageField";
import { groupSchema } from "@/lib/validation";

const EVENT_DEFAULTS = {
  day: "everyday",
  startAt: "12:00",
  duration: "60",
};

const useStyles = makeStyles((theme) => ({
  groupPaper: {
    padding: "1em",
  },
  submitRow: {
    marginTop: "2em",
  },
}));

const GroupForm = ({ group, onSubmit }) => {
  const classes = useStyles();
  return (
    <Form
      initialValues={group}
      invalidFormSnackbar="Please correct the errors."
      validationSchema={groupSchema}
      validateOnChange={false}
      onSubmit={async (values) => onSubmit(values)}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Group</Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.groupPaper}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormTextField
                  name="title"
                  label="Title"
                  required
                  fullWidth
                  autoFocus
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <UploadImageField label="Image" name="image" />
              </Grid>
              <Grid item xs={12}>
                <FormTextField
                  name="description"
                  label="Description"
                  multiline
                  fullWidth
                  rowsMax={4}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TimeZoneField
                  name="timezone"
                  label="Time Zone"
                  required
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Paper>
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
          <FormSubmitButton>
            {group?.id ? "Update" : "Create"} Group
          </FormSubmitButton>
        </Grid>
      </Grid>
    </Form>
  );
};

export default GroupForm;

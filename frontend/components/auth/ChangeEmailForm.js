import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";

import Form from "@/components/Form";
import FormTextField from "@/components/FormTextField";
import FormSubmitButton from "@/components/FormSubmitButton";
import { changeEmailSchema } from "@/lib/validation";

const ChangeEmailForm = (props) => {
  return (
    <Form validationSchema={changeEmailSchema} {...props}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Change Email</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormTextField label="Email" name="email" type="email" />
        </Grid>
        <Grid item xs={12}>
          <FormSubmitButton startIcon={<AlternateEmailIcon />}>
            Update Email
          </FormSubmitButton>
        </Grid>
      </Grid>
    </Form>
  );
};

export default ChangeEmailForm;

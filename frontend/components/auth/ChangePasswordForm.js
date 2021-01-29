import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import LockIcon from "@material-ui/icons/Lock";

import Form from "@/components/Form";
import FormPasswordField from "@/components/FormPasswordField";
import FormSubmitButton from "@/components/FormSubmitButton";
import { changePasswordSchema } from "@/lib/validation";

const ChangePasswordForm = (props) => (
  <Form
    initialValues={{ oldPassword: "", newPassword: "" }}
    validationSchema={changePasswordSchema}
    {...props}
  >
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Change Password</Typography>
      </Grid>
      <Grid item xs={12}>
        <FormPasswordField
          autoComplete="current-password"
          label="Old Password"
          name="oldPassword"
        />
      </Grid>
      <Grid item xs={12}>
        <FormPasswordField
          autoComplete="new-password"
          label="New Password"
          name="newPassword"
        />
      </Grid>
      <Grid item xs={12}>
        <FormSubmitButton startIcon={<LockIcon />}>
          Update Password
        </FormSubmitButton>
      </Grid>
    </Grid>
  </Form>
);

export default ChangePasswordForm;

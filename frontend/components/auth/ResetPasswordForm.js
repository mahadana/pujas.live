import Grid from "@material-ui/core/Grid";
import LockIcon from "@material-ui/icons/Lock";

import AuthForm from "@/components/auth/AuthForm";
import FormPasswordField from "@/components/FormPasswordField";
import FormSubmitButton from "@/components/FormSubmitButton";
import { resetPasswordSchema } from "@/lib/validation";

const ResetPasswordForm = (props) => (
  <AuthForm
    disableCaptcha
    lead="Please enter a new password..."
    validationSchema={resetPasswordSchema}
    {...props}
  >
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormPasswordField
          autoComplete="new-password"
          label="New Password"
          name="password"
        />
      </Grid>
      <Grid item xs={12}>
        <FormSubmitButton size="large" startIcon={<LockIcon />}>
          Update Password
        </FormSubmitButton>
      </Grid>
    </Grid>
  </AuthForm>
);

export default ResetPasswordForm;

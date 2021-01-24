import Grid from "@material-ui/core/Grid";
import LockIcon from "@material-ui/icons/Lock";

import AuthForm from "@/components/auth/AuthForm";
import FormTextField from "@/components/FormTextField";
import FormSubmitButton from "@/components/FormSubmitButton";
import { resetPasswordSchema } from "@/lib/validation";

const ResetPasswordForm = ({ disabled, ...props }) => (
  <AuthForm
    disableCaptcha
    disabled={disabled}
    lead="Please enter a new password..."
    validationSchema={resetPasswordSchema}
    {...props}
  >
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormTextField
          label="New Password"
          name="password"
          type="password"
          autoComplete="new-password"
          variant="outlined"
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={12}>
        <FormSubmitButton
          size="large"
          disabled={disabled}
          startIcon={<LockIcon />}
        >
          Update Password
        </FormSubmitButton>
      </Grid>
    </Grid>
  </AuthForm>
);

export default ResetPasswordForm;

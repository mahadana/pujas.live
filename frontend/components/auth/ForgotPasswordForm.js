import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import EmailIcon from "@material-ui/icons/Email";

import AuthForm from "@/components/auth/AuthForm";
import LoginButtonLink from "@/components/auth/LoginButtonLink";
import RegisterButtonLink from "@/components/auth/RegisterButtonLink";
import FormTextField from "@/components/FormTextField";
import FormSubmitButton from "@/components/FormSubmitButton";
import { forgotPasswordSchema } from "@/lib/validation";

const ForgotPasswordForm = ({ disabled, ...props }) => (
  <AuthForm
    disabled={disabled}
    lead="Forgot password?"
    validationSchema={forgotPasswordSchema}
    {...props}
  >
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormTextField
          autoComplete="username"
          autoFocus
          disabled={disabled}
          label="Email"
          name="email"
          type="email"
        />
      </Grid>
      <Grid item xs={12}>
        <FormSubmitButton
          size="large"
          disabled={disabled}
          startIcon={<EmailIcon />}
        >
          Reset Password
        </FormSubmitButton>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2">
          or you can <LoginButtonLink /> or{" "}
          <RegisterButtonLink color="default" />
        </Typography>
      </Grid>
    </Grid>
  </AuthForm>
);

export default ForgotPasswordForm;

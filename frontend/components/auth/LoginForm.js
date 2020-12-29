import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import AuthForm from "@/components/auth/AuthForm";
import ForgotPasswordButtonLink from "@/components/auth/ForgotPasswordButtonLink";
import RegisterButtonLink from "@/components/auth/RegisterButtonLink";
import FormTextField from "@/components/FormTextField";
import FormSubmitButton from "@/components/FormSubmitButton";
import { loginSchema } from "@/lib/validation";

const LoginForm = ({ disabled, ...props }) => (
  <AuthForm
    disableCaptcha
    disabled={disabled}
    lead="Login to your account to continue..."
    validationSchema={loginSchema}
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
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <FormTextField
          autoComplete="current-password"
          disabled={disabled}
          label="Password"
          name="password"
          type="password"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <FormSubmitButton
          disabled={disabled}
          size="large"
          startIcon={<ExitToAppIcon />}
        >
          Login
        </FormSubmitButton>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2">
          <RegisterButtonLink /> <ForgotPasswordButtonLink />
        </Typography>
      </Grid>
    </Grid>
  </AuthForm>
);

export default LoginForm;

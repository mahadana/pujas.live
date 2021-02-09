import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import AuthForm from "@/components/auth/AuthForm";
import ForgotPasswordButtonLink from "@/components/auth/ForgotPasswordButtonLink";
import RegisterButtonLink from "@/components/auth/RegisterButtonLink";
import FormPasswordField from "@/components/FormPasswordField";
import FormTextField from "@/components/FormTextField";
import FormSubmitButton from "@/components/FormSubmitButton";
import { loginSchema } from "@/lib/validation";

const LoginForm = (props) => (
  <AuthForm
    disableCaptcha
    lead="Please login to continue..."
    validateOnBlur={false}
    validateOnChange={false}
    validationSchema={loginSchema}
    {...props}
  >
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormTextField
          autoComplete="username"
          autoFocus
          label="Email"
          name="email"
          type="email"
        />
      </Grid>
      <Grid item xs={12}>
        <FormPasswordField
          autoComplete="current-password"
          label="Password"
          name="password"
        />
      </Grid>
      <Grid item xs={12}>
        <FormSubmitButton size="large" startIcon={<ExitToAppIcon />}>
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

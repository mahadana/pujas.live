import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";

import AuthForm from "@/components/auth/AuthForm";
import LoginButtonLink from "@/components/auth/LoginButtonLink";
import FormPasswordField from "@/components/FormPasswordField";
import FormTextField from "@/components/FormTextField";
import FormSubmitButton from "@/components/FormSubmitButton";
import { registerSchema } from "@/lib/validation";

const RegisterForm = ({ disabled, ...props }) => (
  <AuthForm
    disabled={disabled}
    lead="Create an account to continue..."
    validationSchema={registerSchema}
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
        <FormPasswordField
          autoComplete="new-password"
          disabled={disabled}
          label="Password"
          name="password"
        />
      </Grid>
      <Grid item xs={12}>
        <FormSubmitButton
          color="secondary"
          disabled={disabled}
          size="large"
          startIcon={<EmojiPeopleIcon />}
        >
          Create Account
        </FormSubmitButton>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2">
          <LoginButtonLink /> if you have an account.
        </Typography>
      </Grid>
    </Grid>
  </AuthForm>
);

export default RegisterForm;

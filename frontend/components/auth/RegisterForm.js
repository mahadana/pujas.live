import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";

import AuthForm from "@/components/auth/AuthForm";
import LoginButtonLink from "@/components/auth/LoginButtonLink";
import FormPasswordField from "@/components/FormPasswordField";
import FormTextField from "@/components/FormTextField";
import FormSubmitButton from "@/components/FormSubmitButton";
import { registerSchema } from "@/lib/validation";

const RegisterForm = (props) => (
  <AuthForm
    lead="Create an account to continue..."
    validateOnBlur={false}
    validateOnChange={false}
    validationSchema={registerSchema}
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
          autoComplete="new-password"
          label="Password"
          name="password"
        />
      </Grid>
      <Grid item xs={12}>
        <FormSubmitButton
          color="secondary"
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

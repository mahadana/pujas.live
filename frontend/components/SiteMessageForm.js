import Grid from "@material-ui/core/Grid";
import SendIcon from "@material-ui/icons/Send";

import CaptchaForm from "@/components/CaptchaForm";
import FormTextField from "@/components/FormTextField";
import FormSubmitButton from "@/components/FormSubmitButton";
import { useUser } from "@/lib/user";
import { siteMessageSchema } from "@/lib/validation";

const SiteMessageForm = ({ onSubmit }) => {
  const { user } = useUser();

  const initialValues = {
    name: "",
    email: user?.email || "",
    message: "",
  };

  return (
    <CaptchaForm
      disableCaptcha={!!user}
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={siteMessageSchema}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormTextField name="name" label="Name" fullWidth required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormTextField name="email" label="Email" fullWidth required />
        </Grid>
        <Grid item xs={12}>
          <FormTextField
            name="message"
            label="Message"
            fullWidth
            multiline
            required
            rows={8}
          />
        </Grid>
        <Grid item xs={12}>
          <FormSubmitButton startIcon={<SendIcon />}>
            Send Message
          </FormSubmitButton>
        </Grid>
      </Grid>
    </CaptchaForm>
  );
};

export default SiteMessageForm;

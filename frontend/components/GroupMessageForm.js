import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SendIcon from "@material-ui/icons/Send";

import CaptchaForm from "@/components/CaptchaForm";
import FormTextField from "@/components/FormTextField";
import FormSubmitButton from "@/components/FormSubmitButton";
import { useUser } from "@/lib/user";
import { groupMessageSchema } from "@/lib/validation";

const useStyles = makeStyles((theme) => ({
  leader: {
    fontWeight: "bold",
  },
}));

const GroupMessageForm = ({ group, onSubmit }) => {
  const classes = useStyles();
  const { user } = useUser();

  const initialValues = {
    name: "",
    email: user?.email || "",
    interest: "",
    experience: "",
  };

  return (
    <CaptchaForm
      disableCaptcha={!!user}
      initialValues={initialValues}
      onSubmit={onSubmit}
      validateOnChange={false}
      validationSchema={groupMessageSchema}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Join group "{group.title}"
          </Typography>
          <Typography variant="body1">
            Please fill out the following form to to send a message to the owner
            of the group. Once they review your information, they will provide
            you with the links, etc. to participate in the group sittings.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.leader} variant="body1">
            Your information:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormTextField name="name" label="Name" fullWidth required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormTextField name="email" label="Email" fullWidth required />
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.leader} variant="body1">
            What are you looking for in a meditation group?
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormTextField
            name="interest"
            fullWidth
            multiline
            required
            rowsMax={10}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.leader} variant="body1">
            Please describe your experience/interest in the Thai Forest
            tradition:
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormTextField
            name="experience"
            fullWidth
            multiline
            required
            rowsMax={10}
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

export default GroupMessageForm;

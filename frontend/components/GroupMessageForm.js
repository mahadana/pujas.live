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
    fontSize: "1.14em",
    fontWeight: "bold",
  },
}));

const GroupMessageForm = ({ disabled, group, onSubmit }) => {
  const classes = useStyles();
  const { user } = useUser();
  const myOnSubmit = async (values, actions, token) => {
    values = {
      ...values,
      message: `Q. What are you looking for in a meditation group?

${values.interest}

Q. Please describe your experience/interest in the Thai Forest tradition:

${values.experience}`,
    };
    return await onSubmit(values, actions, token);
  };
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
      invalidFormSnackbar="Please check your message"
      onSubmit={myOnSubmit}
      validateOnChange={false}
      validationSchema={groupMessageSchema}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">
            Send message to owner of "{group.name}"
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.leader}>
          Your information:
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormTextField
            name="name"
            label="Name"
            required
            fullWidth
            variant="outlined"
            autoFocus
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormTextField
            name="email"
            label="Email"
            required
            fullWidth
            variant="outlined"
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} className={classes.leader}>
          What are you looking for in a meditation group?
        </Grid>
        <Grid item xs={12}>
          <FormTextField
            name="interest"
            multiline
            rowsMax={10}
            required
            fullWidth
            variant="outlined"
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} className={classes.leader}>
          Please describe your experience/interest in the Thai Forest tradition:
        </Grid>
        <Grid item xs={12}>
          <FormTextField
            name="experience"
            multiline
            rowsMax={10}
            required
            fullWidth
            variant="outlined"
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12}>
          <FormSubmitButton disabled={disabled} startIcon={<SendIcon />}>
            Send Message
          </FormSubmitButton>
        </Grid>
      </Grid>
    </CaptchaForm>
  );
};

export default GroupMessageForm;

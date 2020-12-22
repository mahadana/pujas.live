import { Button, Grid, TextField, makeStyles } from "@material-ui/core";
import { useFormik } from "formik";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const GroupMessage = ({ groupId, groupName, user }) => {
  const classes = useStyles();
  const loading = false; // TODO
  const formik = useFormik({
    initialValues: {
      name: "",
      email: user?.email || "",
      interest: "",
      experience: "",
    },
    onSubmit: async (data) => {
      alert('TODO ' + JSON.stringify(data));
    },
  });

  return (
    <>
      <h2 className={classes.lead}>Send Message to {groupName}</h2>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={6}>
            <p>Your information:</p>
            <TextField
              name="name"
              label="Name"
              error={formik.errors.name && formik.touched.name}
              helperText={formik.touched.name && formik.errors.name}
              required
              fullWidth
              variant="outlined"
              {...formik.getFieldProps("name")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Email"
              error={formik.errors.email && formik.touched.email}
              helperText={formik.touched.email && formik.errors.email}
              required
              fullWidth
              variant="outlined"
              {...formik.getFieldProps("email")}
            />
          </Grid>
          <Grid item xs={12}>
            <p>What are you looking for in a meditation group?</p>
            <TextField
              name="interest"
              multiline
              fullWidth
              rows="3"
              variant="outlined"
              {...formik.getFieldProps("interest")}
            />
          </Grid>
          <Grid item xs={12}>
            <p>
              Please describe your experience/interest in the Thai Forest
              tradition:
            </p>
            <TextField
              name="experience"
              multiline
              fullWidth
              rows="3"
              variant="outlined"
              {...formik.getFieldProps("experience")}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={formik.handleSubmit}
              disabled={loading}
            >
              Send Message
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default GroupMessage;

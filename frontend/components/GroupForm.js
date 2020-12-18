import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import fetch from "cross-fetch";
import { Button, Container, Grid, TextField } from "@material-ui/core";
import { apiUrl, UserContext } from "../lib/context";

const validationSchema = yup.object({
  email: yup.string().email("Invalid email address").required("Required"),
  emailConfirmation: yup
    .string()
    .oneOf([yup.ref("email"), null], "Emails must match")
    .email("Invalid email address")
    .required("Required"),
  name: yup.string().required("Required"),
});

function GroupForm(props) {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: user?.email || "",
      emailConfirmation: user?.email || "",
      name: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (data) => {
      setLoading(true);
      const response = await fetch(`${apiUrl}/groups/prepare`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      setLoading(false);
      props.onSuccess(data);
    },
  });

  return (
    <Container maxWidth="md">
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Your email"
              error={formik.errors.email && formik.touched.email}
              helperText={formik.touched.email && formik.errors.email}
              required
              fullWidth
              variant="outlined"
              {...formik.getFieldProps("email")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="emailConfirmation"
              label="Confirm email"
              error={
                formik.errors.emailConfirmation &&
                formik.touched.emailConfirmation
              }
              helperText={
                formik.touched.emailConfirmation &&
                formik.errors.emailConfirmation
              }
              required
              fullWidth
              variant="outlined"
              {...formik.getFieldProps("emailConfirmation")}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Group Name"
              error={formik.errors.name && formik.touched.name}
              helperText={formik.touched.name && formik.errors.name}
              required
              fullWidth
              variant="outlined"
              {...formik.getFieldProps("name")}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              multiline
              fullWidth
              rows="4"
              variant="outlined"
              {...formik.getFieldProps("description")}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={formik.handleSubmit}
              disabled={loading}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default GroupForm;

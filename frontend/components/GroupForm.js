import React, { useState } from "react";
import { setNestedObjectValues, useFormik } from "formik";
import * as yup from "yup";
import { Button, Container, Grid, TextField } from "@material-ui/core";

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
  const formik = useFormik({
    initialValues: {
      email: "",
      emailConfirmation: "",
      name: "",
      description: "",
    },
    validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
      props.onSuccess();
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

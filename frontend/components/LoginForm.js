import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { Box, Button, makeStyles, TextField } from "@material-ui/core";
import { withApolloAndUser } from "../lib/context";

const useStyles = makeStyles((theme) => ({
  root: {
    border: "1px solid #aaa",
    maxWidth: "40em",
    padding: "3em",
    margin: "auto",
  },
  field: {
    margin: "1em 0",
    textAlign: "center",
    height: "6em",
  },
  button: {
    textAlign: "center",
  },
}));

const validationSchema = yup.object({
  email: yup.string().required("Required"),
  password: yup.string().required("Required"),
});

const LOGIN = gql`
  mutation Login($input: UsersPermissionsLoginInput!) {
    login(input: $input) {
      jwt
      user {
        id
        email
      }
    }
  }
`;

function LoginForm(props) {
  const classes = useStyles();
  const [loginMutation, { loading, error }] = useMutation(LOGIN, {
    onCompleted: (response) => {
      props.onSuccess(response.login.user, response.login.jwt);
    },
    onError: (myerror) => {
      // To catch uncaught exceptions...
    },
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: ({ email, password }) => {
      loginMutation({
        variables: {
          input: {
            identifier: email,
            password,
          },
        },
      });
    },
  });

  return (
    <Box className={classes.root}>
      <form onSubmit={formik.handleSubmit} noValidate autoComplete="off">
        <Box className={classes.field}>
          <TextField
            label="Email"
            name="email"
            error={(formik.errors.email && formik.touched.email) || !!error}
            helperText={formik.touched.email && formik.errors.email}
            variant="outlined"
            {...formik.getFieldProps("email")}
          />
        </Box>
        <Box className={classes.field}>
          <TextField
            label="Password"
            name="password"
            type="password"
            error={(formik.errors.password && formik.touched.password) || !!error}
            helperText={formik.touched.password && formik.errors.password}
            variant="outlined"
            {...formik.getFieldProps("password")}
          />
        </Box>
        <Box className={classes.button}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            Login
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default withApolloAndUser()(LoginForm);

// See https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js

import React, { useState } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import JsCookie from "js-cookie";
import { UserContext } from "../lib/context";
import theme from "../lib/theme";

const MyApp = ({ Component, pageProps }) => {
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState(null);

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const userContext = {
    alert,
    alertUser: (message, severity = "info") => {
      setAlert({ message, severity, key: new Date().getTime() });
    },
    loginUser: (user, jwt) => {
      JsCookie.set("jwt", jwt);
      setUser(user);
    },
    logoutUser: () => {
      JsCookie.remove("jwt");
      setUser(null);
    },
    setAlert,
    setUser,
    user,
  };

  return (
    <React.Fragment>
      <Head>
        <title>My page</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <UserContext.Provider value={userContext}>
          <Component {...pageProps} />
        </UserContext.Provider>
      </ThemeProvider>
    </React.Fragment>
  );
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;

// See https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import Head from "next/head";
import PropTypes from "prop-types";
import { useEffect } from "react";

import LoadingProvider from "@/components/LoadingProvider";
import SnackbarProvider from "@/components/SnackbarProvider";
import UserProvider from "@/components/UserProvider";
import { plausibleDomain } from "@/lib/plausible";
import theme from "@/lib/theme";

const MyApp = ({ Component, pageProps }) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Pujas.live</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <script
          async
          defer
          data-domain={plausibleDomain}
          src="https://plausible.pujas.live/js/plausible.js"
        />
      </Head>
      <style jsx global>
        {`
          body {
            overflow-y: scroll;
          }
        `}
      </style>
      <ThemeProvider theme={theme}>
        <UserProvider>
          <SnackbarProvider>
            <LoadingProvider>
              <CssBaseline />
              <Component {...pageProps} />
            </LoadingProvider>
          </SnackbarProvider>
        </UserProvider>
      </ThemeProvider>
    </>
  );
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;

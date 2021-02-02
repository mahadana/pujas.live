// See https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Head from "next/head";
import { useEffect } from "react";

import ChannelRecordingsModal from "@/components/ChannelRecordingsModal";
import ChantingBooksModal from "@/components/ChantingBooksModal";
import LoadingProvider from "@/components/LoadingProvider";
import SnackbarProvider from "@/components/SnackbarProvider";
import UserProvider from "@/components/UserProvider";
import VideoModal from "@/components/VideoModal";
import { plausibleUrl, plausibleDomainKey } from "@/lib/plausible";
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
          data-domain={plausibleDomainKey}
          src={`${plausibleUrl}/js/plausible.js`}
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
              <ChantingBooksModal>
                <VideoModal>
                  <ChannelRecordingsModal>
                    <CssBaseline />
                    <Component {...pageProps} />
                  </ChannelRecordingsModal>
                </VideoModal>
              </ChantingBooksModal>
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

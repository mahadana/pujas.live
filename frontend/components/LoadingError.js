import Button from "@material-ui/core/Button";
import NoSsr from "@material-ui/core/NoSsr";
import Alert from "@material-ui/lab/Alert";
import { useEffect, useRef } from "react";

const refetchTimeout = 5000;

import Box from "@material-ui/core/Box";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: "1rem",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 10000,
    "& > div": {
      boxShadow: "1px 1px 6px rgb(0 0 0 / 80%)",
    },
  },
}));

const LoadingError = ({ error, refetchers }) => {
  const errorInterval = useRef(null);
  const classes = useStyles();

  const clearErrorInterval = () => {
    if (errorInterval.current) {
      clearInterval(errorInterval.current);
    }
    errorInterval.current = null;
  };

  useEffect(() => {
    clearErrorInterval();
    if (error) {
      errorInterval.current = setInterval(() => {
        for (const refetch of refetchers) {
          refetch();
        }
      }, refetchTimeout);
    }
  }, [error]);

  useEffect(() => {
    return () => clearErrorInterval();
  }, []);

  const reloadWindow = () => window.location.reload();

  return (
    <NoSsr>
      <Fade
        in={error}
        mountOnEnter
        timeout={{ enter: 400, exit: 2000 }}
        unmountOnExit
      >
        <Box className={classes.root}>
          <Alert
            action={
              <Button color="inherit" onClick={reloadWindow} size="small">
                Reload
              </Button>
            }
            severity="error"
          >
            <strong>Temporary Server Error</strong>
          </Alert>
        </Box>
      </Fade>
    </NoSsr>
  );
};

export default LoadingError;

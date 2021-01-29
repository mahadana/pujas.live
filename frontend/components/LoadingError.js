import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import NoSsr from "@material-ui/core/NoSsr";
import Typography from "@material-ui/core/Typography";
import ErrorIcon from "@material-ui/icons/Error";
import { useEffect, useRef } from "react";

const refetchTimeout = 5000;

const LoadingError = ({ error, errors, refetchers }) => {
  const errorInterval = useRef(null);

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

  const onClick = () => {
    window.location.reload();
  };

  return (
    <NoSsr>
      <Dialog
        aria-labelledby="error-dialog-title"
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="sm"
        open={error}
      >
        <DialogTitle id="error-dialog-title">Server Error</DialogTitle>
        <DialogContent dividers>
          <List>
            {errors.map((error, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <ErrorIcon />
                </ListItemIcon>
                <ListItemText primary={error.message} />
              </ListItem>
            ))}
          </List>
          <Typography variant="body1">
            Sorry! Please wait or try again later...
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClick} color="primary">
            Reload
          </Button>
        </DialogActions>
      </Dialog>
    </NoSsr>
  );
};

export default LoadingError;

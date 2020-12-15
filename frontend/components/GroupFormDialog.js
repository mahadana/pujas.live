import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Button,
  Dialog,
  IconButton,
  Snackbar,
  Toolbar,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Alert from "@material-ui/lab/Alert";
import GroupForm from "../components/GroupForm";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
    marginBottom: "2em",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Test() {
  const classes = useStyles();
  const [dialog, setDialog] = React.useState(false);
  const [alert, setAlert] = React.useState(false);

  const onSuccess = () => {
    setDialog(false);
    setAlert(true);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setDialog(true)}
      >
        Post new group...
      </Button>
      <Snackbar
        open={alert}
        autoHideDuration={6000}
        onClose={() => setAlert(false)}
      >
        <Alert onClose={() => setAlert(false)} severity="success">
          Please check your email to confirm the group.
        </Alert>
      </Snackbar>
      <Dialog
        fullScreen
        open={dialog}
        onClose={() => setDialog(false)}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDialog(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Post New Group
            </Typography>
          </Toolbar>
        </AppBar>
        <GroupForm onSuccess={onSuccess} />
      </Dialog>
    </>
  );
}

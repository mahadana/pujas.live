import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Dialog,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import GroupForm from "../components/GroupForm";
import { UserContext } from "../lib/context";

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
  const { alertUser } = useContext(UserContext);
  const [dialog, setDialog] = React.useState(false);

  const onSuccess = (data) => {
    setDialog(false);
    alertUser(`Please check your email at ${data.email} to confirm the post.`);
  };

  return (
    <>
      <Link
        variant="outlined"
        color="primary"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setDialog(true);
        }}
      >
        <a>+ Click here to post new group</a>
      </Link>
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

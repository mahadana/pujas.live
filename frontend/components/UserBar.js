import { useContext, useEffect, useState } from "react";
import {
  Button,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Snackbar,
  Toolbar,
  Typography,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { AccountCircle } from "@material-ui/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserContext, withApolloAndUser } from "../lib/context";
import { set } from "js-cookie";

const useStyles = makeStyles((theme) => ({
  root: {
    justifyContent: "flex-end",
  },
  email: {
    margin: 0,
  },
}));

const MySnackbar = () => {
  const { alert, setAlert } = useContext(UserContext);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const lastKey = currentAlert?.key;
    if (alert && (!lastKey || alert.key > lastKey)) {
      setCurrentAlert(alert);
      setIsOpen(true);
    }
  }, [alert]);

  const close = (event, reason) => {
    if (reason !== "clickaway" && isOpen) {
      setIsOpen(false);
      setAlert(null);
    }
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={6000}
      onClose={close}
      key={currentAlert?.key}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        severity={currentAlert?.severity}
        onClose={close}
      >
        {currentAlert?.message}
      </MuiAlert>
    </Snackbar>
  );
};

const UserBar = () => {
  const classes = useStyles();
  const router = useRouter();
  const { alertUser, logoutUser, user } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    closeMenu();
    logoutUser();
    alertUser("You were logged out.");
  };

  const gotoAccount = () => {
    closeMenu();
    router.push("/account");
  };

  if (user) {
    return (
      <>
        <Toolbar className={classes.root}>
          <Typography variant="h6" className={classes.email} onClick={openMenu}>
            {user.email}
          </Typography>
          <IconButton
            aria-label="account"
            aria-haspopup="true"
            onClick={openMenu}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={closeMenu}
          >
            <MenuItem onClick={gotoAccount}>My Account</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
        <MySnackbar />
      </>
    );
  } else {
    return (
      <>
        <Toolbar className={classes.root}>
          <Link href="/login">
            <Button color="primary">Login</Button>
          </Link>
        </Toolbar>
        <MySnackbar />
      </>
    );
  }
};

export default withApolloAndUser()(UserBar);

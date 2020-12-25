import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

import ButtonLink from "./ButtonLink";
import { useSnackbar } from "../lib/snackbar";
import { useUser } from "../lib/user";

const useStyles = makeStyles((theme) => ({
  root: {
    justifyContent: "flex-end",
  },
  email: {
    cursor: "pointer",
    margin: 0,
  },
}));

const UserBar = () => {
  const classes = useStyles();
  const router = useRouter();
  const anchor = useRef();
  const [open, setOpen] = useState(false);
  const { snackInfo } = useSnackbar();
  const { logout, user } = useUser();

  const openMenu = () => setOpen(true);
  const closeMenu = () => setOpen(false);
  const doAccount = () => {
    closeMenu();
    router.push("/auth/account");
  };
  const doLogout = () => {
    closeMenu();
    logout();
    snackInfo("You were logged out.");
  };

  const loginUrl =
    "/auth/login" +
    (router.asPath ? "?back=" + encodeURIComponent(router.asPath) : "");

  return (
    <Toolbar className={classes.root}>
      {user ? (
        <>
          <Typography variant="h6" className={classes.email} onClick={openMenu}>
            {user.email}
          </Typography>
          <IconButton
            aria-label="account"
            aria-haspopup="true"
            ref={anchor}
            onClick={openMenu}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchor.current}
            keepMounted
            open={open}
            onClose={closeMenu}
          >
            <MenuItem onClick={doAccount}>My Account</MenuItem>
            <MenuItem onClick={doLogout}>Logout</MenuItem>
          </Menu>
        </>
      ) : (
        <ButtonLink href={loginUrl} color="primary">
          Login
        </ButtonLink>
      )}
    </Toolbar>
  );
};

export default UserBar;

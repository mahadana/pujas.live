import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";
import { useState } from "react";

import ButtonLink from "@/components/ButtonLink";
import plausible from "@/lib/plausible";
import { useSnackbar } from "@/lib/snackbar";
import { useUser } from "@/lib/user";
import { getPushBackUrl } from "@/lib/util";

const useStyles = makeStyles((theme) => ({
  root: {
    justifyContent: "flex-end",
  },
  loginLink: {
    color: "white",
  },
  email: {
    cursor: "pointer",
    margin: 0,
  },
}));

const UserButton = () => {
  const router = useRouter();
  const { snackInfo } = useSnackbar();
  const [anchor, setAnchor] = useState(null);
  const classes = useStyles();
  const { logout, user, userLoading } = useUser();

  const openMenu = (event) => {
    setAnchor(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchor(null);
  };
  const doAccount = () => {
    closeMenu();
    router.push("/auth/account");
  };
  const doLogout = () => {
    closeMenu();
    logout();
    snackInfo("You were logged out");
    plausible("logout");
  };

  if (!user && userLoading) {
    return null;
  } else if (!user) {
    return (
      <ButtonLink
        className={classes.loginLink}
        href={getPushBackUrl(router, "/auth/login")}
      >
        Login
      </ButtonLink>
    );
  }

  return (
    <Box>
      <Typography
        ref={anchor}
        variant="h6"
        className={classes.email}
        onClick={openMenu}
      >
        {user.email}
      </Typography>
      <Menu
        anchorEl={anchor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        keepMounted
        open={!!anchor}
        onClose={closeMenu}
      >
        <MenuItem onClick={doAccount}>My Account</MenuItem>
        <MenuItem onClick={doLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default UserButton;

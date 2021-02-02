import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useRouter } from "next/router";
import { useState } from "react";

import ButtonLink from "@/components/ButtonLink";
import { useRouteBack } from "@/lib/path";
import plausible from "@/lib/plausible";
import { useUser } from "@/lib/user";

const UserButton = () => {
  const router = useRouter();
  const routeBack = useRouteBack(router);
  const [anchor, setAnchor] = useState(null);
  const { logout, user, userLoading } = useUser();

  const openMenu = (event) => {
    event.preventDefault();
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
    plausible("logout");
  };

  if (!user && userLoading) {
    return null;
  } else if (!user) {
    return <ButtonLink href={routeBack.get("/auth/login")}>Login</ButtonLink>;
  } else {
    return (
      <>
        <ButtonLink href="/account" onClick={openMenu}>
          {user.email}
        </ButtonLink>
        <Menu
          anchorEl={anchor}
          anchorOrigin={{
            horizontal: "center",
            vertical: "bottom",
          }}
          anchorReference="anchorEl"
          keepMounted
          getContentAnchorEl={null}
          onClose={closeMenu}
          open={!!anchor}
          transformOrigin={{
            horizontal: "center",
            vertical: "top",
          }}
        >
          <MenuItem onClick={doAccount}>Account Settings</MenuItem>
          <MenuItem onClick={doLogout}>Logout</MenuItem>
        </Menu>
      </>
    );
  }
};

export default UserButton;

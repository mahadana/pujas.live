import React, { useEffect, useContext } from "react";
import Cookies from "cookies";
import { useRouter } from "next/router";
import { UserContext } from "../lib/context";

function Logout() {
  const router = useRouter();
  const { logoutUser } = useContext(UserContext);
  useEffect(() => {
    logoutUser();
    router.push("/");
  }, []);
  return <div />;
}

Logout.getInitialProps = async ({ req, res }) => {
  console.log('getinitialprops');
  if (req) {
    const cookies = new Cookies(req, res);
    cookies.set("jwt");
    res.writeHead(302, { Location: "/" });
    res.end();
  }
  return {};
};

export default Logout;

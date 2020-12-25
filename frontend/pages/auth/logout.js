import Cookies from "cookies";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useUser } from "../../lib/user";
import { getBackFromQuery, pushBack } from "../../lib/util";

function Logout() {
  const router = useRouter();
  const { logout } = useUser();
  useEffect(() => {
    logout();
    pushBack(router);
  }, []);
  return <div />;
}

Logout.getInitialProps = async ({ req, res }) => {
  if (req) {
    const cookies = new Cookies(req, res);
    cookies.set("jwt");
    res.writeHead(302, { Location: getBackFromQuery(res.query) });
    res.end();
  }
  return {};
};

export default Logout;

import { useRouter } from "next/router";
import Cookies from "cookies";
import fetch from "cross-fetch";

import { apiUrl } from "../../../lib/apollo";

const Group = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/groups/${router.query.id}");
  }, []);
  return <div />;
};

Group.getInitialProps = async ({ pathname, query, req, res }) => {
  if (req) {
    const cookies = new Cookies(req, res);
    let jwt = cookies.get("jwt");
    const loginToken = query.token;
    if (loginToken) {
      const response = await fetch(`${apiUrl}/auth/token`, {
        method: "POST",
        body: JSON.stringify({ loginToken }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        jwt = data.jwt;
        cookies.set("jwt", jwt, { httpOnly: false });
      }
    }
    if (jwt && query.id) {
      const response = await fetch(`${apiUrl}/groups/${query.id}`, {
        method: "PUT",
        body: JSON.stringify({ confirmed: true }),
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      });
    }
    res.writeHead(302, { Location: `/groups/${query.id}` });
    res.end();
  }
  return { _: null };
};

export default Group;

import { useRouter } from "next/router";
import Cookies from "cookies";
import fetch from "cross-fetch";
import { apiUrl } from "../../../lib/context";

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
    console.log(query);
    if (loginToken) {
      console.log("fetching jwt");
      const response = await fetch(`${apiUrl}/auth/token`, {
        method: "POST",
        body: JSON.stringify({ loginToken }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        jwt = data.jwt;
        cookies.set("jwt", jwt, { httpOnly: false });
        console.log("got jwt", jwt);
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
      if (response.ok) {
        console.log("confirmed group");
      }
    }
    res.writeHead(302, { Location: `/groups/${query.id}` });
    res.end();
  }
  return { _: null };
};

export default Group;

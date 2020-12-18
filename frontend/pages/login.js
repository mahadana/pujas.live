import React, { useContext } from "react";
import { useRouter } from "next/router";
import Cookies from "cookies";
import Banner from "../components/Banner";
import LoginForm from "../components/LoginForm";
import UserBar from "../components/UserBar";
import { UserContext, withApolloAndUser } from "../lib/context";

function Login(props) {
  const router = useRouter();
  const { alertUser, loginUser } = useContext(UserContext);

  const login = (user, jwt) => {
    loginUser(user, jwt);
    alertUser("You are logged in as " + user.email, "success");
    router.push("/");
  };

  return (
    <>
      <Banner />
      <UserBar />
      <LoginForm onSuccess={login} />
    </>
  );
}

Login.getInitialProps = async ({ req, res }) => {
  if (req) {
    const cookies = new Cookies(req, res);
    if (cookies.get("jwt")) {
      res.writeHead(302, { Location: "/" });
      res.end();
    }
  }
  return {};
};

export default withApolloAndUser({ ssr: true })(Login);

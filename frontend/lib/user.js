import JsCookie from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import { apolloClient } from "./apollo";
import { ME_QUERY } from "./schema";

export const UserContext = createContext({
  login: () => undefined,
  logout: () => undefined,
  setUser: () => undefined,
  setUserLoading: () => undefined,
  user: null,
  userLoading: true,
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const context = {
    login: (user, jwt) => {
      setUser(user);
      JsCookie.set("jwt", jwt);
    },
    logout: () => {
      setUser(null);
      JsCookie.remove("jwt");
    },
    setUser,
    setUserLoading,
    user,
    userLoading,
  };
  useEffect(() => loadUser(context), []);
  return (
    <UserContext.Provider value={context}>{children}</UserContext.Provider>
  );
};

const loadUser = ({ setUser, setUserLoading, user }) => {
  if (typeof window === "undefined" || user || !JsCookie.get("jwt")) {
    setUserLoading(false);
    return;
  }
  (async () => {
    try {
      const result = await apolloClient.query({ query: ME_QUERY });
      setUser(result.data.me);
    } catch (error) {
      console.error(error);
      setUser(null);
    }
    setUserLoading(false);
  })();
};

export const useUser = () => useContext(UserContext);

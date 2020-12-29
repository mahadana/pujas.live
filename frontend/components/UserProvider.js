import JsCookie from "js-cookie";
import { useEffect, useState } from "react";

import { apolloClient } from "@/lib/apollo";
import { ME_QUERY } from "@/lib/schema";
import { UserContext } from "@/lib/user";

const loadUser = ({ setUser, setUserLoading, user }) => {
  if (typeof window === "undefined" || user || !JsCookie.get("jwt")) {
    setUserLoading(false);
    return;
  }
  (async () => {
    try {
      const result = await apolloClient.query({
        fetchPolicy: "network-only",
        query: ME_QUERY,
      });
      setUser(result.data.me);
    } catch (error) {
      console.error(error);
      setUser(null);
    }
    setUserLoading(false);
  })();
};

const UserProvider = ({ children }) => {
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

export default UserProvider;

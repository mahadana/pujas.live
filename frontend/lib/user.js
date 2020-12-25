import JsCookie from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext({
  login: () => undefined,
  logout: () => undefined,
  setUser: () => undefined,
  setUserLoading: () => undefined,
  user: null,
  userLoading: false,
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  useEffect(() => {
    if (!JsCookie.get("jwt")) {
      setUserLoading(false);
    }
  }, []);
  const context = {
    login: (user, jwt) => {
      JsCookie.set("jwt", jwt);
      setUser(user);
    },
    logout: () => {
      JsCookie.remove("jwt");
      setUser(null);
    },
    setUser,
    setUserLoading,
    user,
    userLoading,
  };
  return (
    <UserContext.Provider value={context}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

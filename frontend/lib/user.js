import { createContext, useContext } from "react";

export const UserContext = createContext({
  login: () => undefined,
  logout: () => undefined,
  setUser: () => undefined,
  setUserLoading: () => undefined,
  user: null,
  userLoading: true,
});

export const useUser = () => useContext(UserContext);

import { createContext, useContext } from "react";

export const UserContext = createContext({
  login: () => undefined,
  logout: () => undefined,
  setUser: () => undefined,
  setUserError: () => undefined,
  setUserLoading: () => undefined,
  user: null,
  userError: null,
  userLoading: true,
});

export const useUser = () => useContext(UserContext);

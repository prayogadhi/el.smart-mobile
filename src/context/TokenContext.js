import { createContext } from "react";

export const TokenContext = createContext({
  storedToken: {},
  setStoredToken: () => {},
});

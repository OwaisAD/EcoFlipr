import React, { useState, useContext, useEffect } from "react";
import jwtDecode from "jwt-decode";

const AuthContext = React.createContext({
  isAuthenticated: false,
  login: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = (props: { children: JSX.Element }) => {
  const [isAuthenticated, setAuthenticated] = useState(() => {
    const token = localStorage.getItem("ecoflipr-user-token");
    try {
      const decoded = jwtDecode(token!) as { exp: number };
      // Token is a JWT
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem("ecoflipr-user-token");
        return false;
      } else {
        return true;
      }
    } catch (error) {
      return false;
    }
  });

  const login = () => setAuthenticated(true);

  return <AuthContext.Provider value={{ isAuthenticated, login }}>{props.children}</AuthContext.Provider>;
};

import React, { useState, useContext, useEffect } from "react";
import jwtDecode from "jwt-decode";

const AuthContext = React.createContext({
  isAuthenticated: false,
  userId: "",
  login: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = (props: { children: JSX.Element }) => {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("ecoflipr-user-token");
    try {
      const decoded = jwtDecode(token!) as any;
      setUserId(decoded.id);
      setAuthenticated(isTokenValid());
    } catch (error) {
      setUserId("");
      setAuthenticated(false);
    }
  });

  const isTokenValid = () => {
    const token = localStorage.getItem("ecoflipr-user-token");
    try {
      const decoded = jwtDecode(token!) as { exp: number };
      const currentTime = Date.now() / 1000;
      return decoded.exp >= currentTime;
    } catch (error) {
      return false;
    }
  };

  const [isAuthenticated, setAuthenticated] = useState(isTokenValid());

  useEffect(() => {
    if (!isTokenValid()) {
      localStorage.removeItem("ecoflipr-user-token");
      setAuthenticated(false);
    }
  }, [isAuthenticated]);

  const login = () => setAuthenticated(true);

  return <AuthContext.Provider value={{ isAuthenticated, userId, login }}>{props.children}</AuthContext.Provider>;
};

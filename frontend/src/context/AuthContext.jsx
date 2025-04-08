import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");

  useEffect(() => {
  }, [token, userRole]);

  const login = (token, role) => {
    if (!role) {
      return;
    }
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setToken(token);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setUserRole("");
  };

  return (
    <AuthContext.Provider value={{ token, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

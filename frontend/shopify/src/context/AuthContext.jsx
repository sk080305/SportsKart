import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
 useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      setUser(parsed.user ? parsed.user : parsed); // flatten if needed
    } catch (e) {
      console.error("Failed to parse user:", e);
      localStorage.removeItem("user");
    }
  }
  setLoading(false);
}, []);

  // Login — store user directly (not wrapped inside another object)
  const login = (userData) => {
  const flattenedUser = userData.user ? userData.user : userData;
  setUser(flattenedUser);
  localStorage.setItem("user", JSON.stringify(flattenedUser));
};
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the current user from backend
  const fetchUser = async () => {
    setLoading(true); // start loading whenever we check
    try {
      const res = await axios.get(
        `https://authentication-backend-5s9c.onrender.com/api/check-auth`,
        { withCredentials: true }
      );
      setUser(res.data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Check user on mount
  useEffect(() => {
    fetchUser();
  }, []);

  // Helper for logout to reset state
  const logout = async () => {
    try {
      await axios.post(
        `https://authentication-backend-5s9c.onrender.com/api/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null); // clear user state
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

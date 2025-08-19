"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "../usecontext/AuthContext.js";

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  const { user, setUser } = useAuth(); // ✅ use global auth

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!event.target.checkValidity()) {
      event.target.reportValidity();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `https://authentication-backend-5s9c.onrender.com/api/login`,
        { email, password },
        { withCredentials: true }
      );

      setMessage(response.data.message || "Login successful");

      // ✅ update global user so ALL pages know
      setUser(response.data.user);

      // Optional: redirect to home
      
      if(response.status==200){
window.location.href = "/";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `https://authentication-backend-5s9c.onrender.com/api/logout`,
        {},
        { withCredentials: true }
      );

      // ✅ clear global user
      setUser(null);

      setMessage("");
      setError("");
    } catch (err) {
      // console.error("Logout error", err);
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        {user ? (
          <>
            <h2 className="form-title">You are logged in</h2>
            <button onClick={handleLogout} className="btn-submit">
              Logout
            </button>
          </>
        ) : (
          <>
            <form onSubmit={handleSubmit} noValidate>
              <h2 className="form-title">Login to Your Account</h2>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="error">{error}</p>}
              {message && <p className="response">{message}</p>}

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <span className="spinner" aria-label="Loading"></span>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <div className="form-footer">
              <div className="new-user">
                <a href="/signup">Sign up</a>
              </div>
              <div className="forget-password">
                <a href="/forgetpassword">Forget Password?</a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;

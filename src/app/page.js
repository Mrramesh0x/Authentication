"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./usecontext/AuthContext.js"; // ✅ import context

const LandingPage = () => {
  const router = useRouter();
  const { user, loading, logout } = useAuth(); // ✅ use global context

  // Prevent render while auth state is being checked
  if (loading) return null;

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">Welcome to Authentication</h1>
        <p className="landing-description">
          Secure and simple authentication system to get you started quickly.
        </p>

        <div className="landing-buttons">
          {user ? (
            <button className="btn-primary" onClick={logout}>
              Logout
            </button>
          ) : (
            <>
              <button
                className="btn-primary"
                onClick={() => router.push("/login")}
              >
                Login
              </button>
              <button
                className="btn-primary"
                onClick={() => router.push("/signup")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

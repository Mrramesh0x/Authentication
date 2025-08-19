"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "../usecontext/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth(); // ✅ use context logout
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Prevent rendering before auth check
  if (loading) return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="logo">
          Home
        </Link>

        <button
          className="hamburger-btn"
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect y="4" width="24" height="2" fill="#fff" />
            <rect y="11" width="24" height="2" fill="#fff" />
            <rect y="18" width="24" height="2" fill="#fff" />
          </svg>
        </button>

        <div className="nav-right">
          {user ? (
            <button onClick={logout} className="btn-outline">
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="btn-outline">
                Login
              </Link>
              <Link href="/signup" className="btn-filled">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-dropdown">
          {user ? (
            <button
              className="mobile-link"
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

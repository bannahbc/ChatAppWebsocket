import React, { useState } from "react";
import { DarkModeToggle } from "../DarkModeToggle";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Define nav items once
  const navItems = [
    { label: "Home", path: "/home" },
    // { label: "Chats", path: "/chats" },
    { label: "Settings", path: "/settings" },
    { label: "Profile",path:"/profile"},
    // { label: "Logout", action: () => navigate("/logout") },
  ];

  return (
    <nav className="bg-[var(--color-bg)] border-b border-[var(--color-border)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to={"/home"} className="flex-shrink-0 text-[var(--color-primary)] font-extrabold text-xl select-none tracking-wider drop-shadow-md">
            VoxaChat
          </Link>

          {/* Dark Mode Toggle */}
          <DarkModeToggle />

          {/* Hamburger for mobile */}
          <div className="lg:hidden">
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation menu"
              className="inline-flex items-center justify-center p-2 rounded-md text-[var(--color-text)] hover:bg-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent-dark)] transition-all duration-300 ease-in-out"
            >
              {open ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Nav Links - large screen */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8 text-[var(--color-text)] font-medium">
            {navItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (item.action) item.action();
                  else navigate(item.path);
                }}
                className="py-2 px-3 rounded hover:bg-[var(--color-accent)] hover:text-[var(--color-primary-dark)] transition-all duration-300 ease-in-out"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dropdown menu for mobile */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-[var(--color-bg)] border-t border-[var(--color-border)] z-50 transform transition-all duration-300 ease-in-out ${
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        {navItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (item.action) item.action();
              else navigate(item.path);
              setOpen(false);
            }}
            className="block w-full text-left px-4 py-3 text-[var(--color-text)] font-medium hover:bg-[var(--color-accent)] hover:text-[var(--color-primary-dark)] transition-all duration-300 ease-in-out"
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;

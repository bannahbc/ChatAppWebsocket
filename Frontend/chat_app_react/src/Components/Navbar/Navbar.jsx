import React, { useState,useEffect } from "react";
import { DarkModeToggle } from "../DarkModeToggle";


const Navbar = () => {
  const [open, setOpen] = useState(false);

  // Optional: toggle dark class on <html> for theme switching
//   useEffect(() => {
//     document.documentElement.classList.add('light'); 
//     return () => document.documentElement.classList.remove('light');
//   }, []);
  return (
    <nav className="bg-[var(--color-bg)] border-b border-[var(--color-border)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center text-[var(--color-primary)] font-extrabold text-xl select-none drop-shadow-md tracking-wider text-shadow-lg">
            VoxaChat
          </div>
          <div className="darkmodetoggle">
            <DarkModeToggle/>
          </div>

          {/* Hamburger for mobile */}
          <div className="lg:hidden">
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation menu"
              className="inline-flex items-center justify-center p-2 rounded-md text-[var(--color-text)] hover:bg-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent-dark)]"
            >
              {open ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Nav Links - large screen */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8 text-[var(--color-text)] font-medium">
            <a
              href="#"
              className="py-2 px-3 rounded hover:bg-[var(--color-accent)] hover:text-[var(--color-primary-dark)] transition"
            >
              Home
            </a>
            <a
              href="#"
              className="py-2 px-3 rounded hover:bg-[var(--color-accent)] hover:text-[var(--color-primary-dark)] transition"
            >
              Chats
            </a>
            <a
              href="#"
              className="py-2 px-3 rounded hover:bg-[var(--color-accent)] hover:text-[var(--color-primary-dark)] transition"
            >
              Contacts
            </a>
            <a
              href="#"
              className="py-2 px-3 rounded hover:bg-[var(--color-accent)] hover:text-[var(--color-primary-dark)] transition"
            >
              Profile
            </a>
          </div>
        </div>
      </div>

      {/* Dropdown menu for mobile */}
      {open && (
  <div className="lg:hidden absolute top-full left-0 w-full bg-[var(--color-bg)] border-t border-[var(--color-border)] z-50">
    <a
      href="#"
      className="block px-4 py-3 text-[var(--color-text)] font-medium hover:bg-[var(--color-accent)] hover:text-[var(--color-primary-dark)] transition"
      onClick={() => setOpen(false)}
    >
      Home
    </a>
    <a
      href="#"
      className="block px-4 py-3 text-[var(--color-text)] font-medium hover:bg-[var(--color-accent)] hover:text-[var(--color-primary-dark)] transition"
      onClick={() => setOpen(false)}
    >
      Chats
    </a>
    <a
      href="#"
      className="block px-4 py-3 text-[var(--color-text)] font-medium hover:bg-[var(--color-accent)] hover:text-[var(--color-primary-dark)] transition"
      onClick={() => setOpen(false)}
    >
      Contacts
    </a>
    <a
      href="#"
      className="block px-4 py-3 text-[var(--color-text)] font-medium hover:bg-[var(--color-accent)] hover:text-[var(--color-primary-dark)] transition"
      onClick={() => setOpen(false)}
    >
      Profile
    </a>
  </div>
)}
    </nav>
  );
};

export default Navbar;

import { useState,useEffect } from "react";
import React from "react";

export  function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      aria-label="Toggle Dark Mode"
      className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-500"
    >
      <div className="relative w-6 h-6 text-yellow-400">
        {/* Sun icon */}
        <svg
          className={`absolute inset-0 w-6 h-6 transition-opacity duration-500 ${
            darkMode ? 'opacity-0' : 'opacity-100'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="5" strokeLinecap="round" strokeLinejoin="round" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M16.36 16.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M16.36 7.64l1.42-1.42"
          />
        </svg>
        {/* Moon icon */}
        <svg
          className={`absolute inset-0 w-6 h-6 transition-opacity duration-500 ${
            darkMode ? 'opacity-100' : 'opacity-0'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          stroke="none"
        >
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      </div>
    </button>
  );
}


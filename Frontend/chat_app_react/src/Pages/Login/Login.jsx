import React, { useState, useEffect } from "react";
import { API } from "../../Api/Axios";
import {useNavigate} from 'react-router-dom'


export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage("");
    setFormData({ email: "", password: "", name: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setMessage("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    const endpoint = isLogin ? "user/login/" : "user/register/";
    let payload;

    if (isLogin) {
      payload = { email: formData.email, password: formData.password };
    } else {
      payload = {
        username: formData.name,
        email: formData.email,
        password: formData.password,
      };
    }

    try {
      const response = await API.post(endpoint, payload);
      const { access, refresh, user } = response.data;

      if (access && refresh) {
        localStorage.setItem("access", access);
        localStorage.setItem("refreshToken", refresh);
        localStorage.setItem("user", JSON.stringify(user));
      }

      setMessage(
        isLogin
          ? `✅ Successfully logged in as ${user?.email || formData.email}`
          : `✅ Registration successful for user ${user?.user_name || formData.name}. Please log in.`
      );

      setTimeout(() => navigate("/home"), 500);
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "An unknown error occurred.";
      setMessage(`❌ Error: ${errorMsg}`);
      console.error("Authentication Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    darkMode ? root.classList.add("dark") : root.classList.remove("dark");
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg transition-colors duration-700 p-6">
      <h1 className="text-text text-5xl font-extrabold mb-6 select-none drop-shadow-md text-shadow-lg">
        VoxaChat
      </h1>

      <button className="absolute top-5 right-5">
        <DarkModeToggle />
      </button>

      <div className="w-full max-w-md bg-bg bg-opacity-90 backdrop-blur-md rounded-xl shadow-2xl p-8 relative overflow-hidden border border-border transition-colors duration-700">
        <div className="flex justify-center mb-10 space-x-14">
          <button
            onClick={() => setIsLogin(true)}
            className={`relative text-2xl font-semibold transition-colors duration-700 ${
              isLogin ? "text-primary" : "text-accent"
            }`}
          >
            Login
            {isLogin && (
              <span className="absolute -bottom-3 left-0 right-0 h-1 bg-primary rounded-full transition-all duration-700"></span>
            )}
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`relative text-2xl font-semibold transition-colors duration-700 ${
              !isLogin ? "text-primary" : "text-accent"
            }`}
          >
            Register
            {!isLogin && (
              <span className="absolute -bottom-3 left-0 right-0 h-1 bg-primary rounded-full transition-all duration-700"></span>
            )}
          </button>
        </div>

        <div className="relative h-auto transition-opacity duration-700 ease-in-out">
          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className={`space-y-6 absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isLogin ? "opacity-100 relative z-10" : "opacity-0 pointer-events-none"
            }`}
          >
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-6 py-3 rounded-md border border-border bg-bg focus:ring-2 focus:ring-primary focus:outline-none text-text placeholder-accent shadow-inner transition-colors duration-700"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-6 py-3 rounded-md border border-border bg-bg focus:ring-2 focus:ring-primary focus:outline-none text-text placeholder-accent shadow-inner transition-colors duration-700"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary hover:bg-primary-dark rounded-md text-white font-semibold shadow-md transition"
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
          </form>

          {/* Register Form */}
          <form
            onSubmit={handleSubmit}
            className={`space-y-6 absolute inset-0 transition-opacity duration-700 ease-in-out ${
              !isLogin ? "opacity-100 relative z-10" : "opacity-0 pointer-events-none"
            }`}
          >
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Username"
              className="w-full px-6 py-3 rounded-md border border-border bg-bg focus:ring-2 focus:ring-primary focus:outline-none text-text placeholder-accent shadow-inner transition-colors duration-700"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-6 py-3 rounded-md border border-border bg-bg focus:ring-2 focus:ring-primary focus:outline-none text-text placeholder-accent shadow-inner transition-colors duration-700"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-6 py-3 rounded-md border border-border bg-bg focus:ring-2 focus:ring-primary focus:outline-none text-text placeholder-accent shadow-inner transition-colors duration-700"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary hover:bg-primary-dark rounded-md text-white font-semibold shadow-md transition"
            >
              {isLoading ? "Loading..." : "Register"}
            </button>
          </form>
        </div>

        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
      </div>
    </div>
  );
}
 function DarkModeToggle() {
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


import React, { useState, useEffect } from "react";
import { API } from "../../Api/Axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../Store/UserSlice";
import {DarkModeToggle} from '../../Components/DarkModeToggle'


export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    setIsLoading(true);

    const endpoint = isLogin ? "user/login/" : "user/register/";
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { username: formData.name, email: formData.email, password: formData.password };

    try {
      const response = await API.post(endpoint, payload, { timeout: 30000 });
      const { access, refresh, user } = response.data;
      console.log("Authentication Response:", user);

      if (access && refresh) {
        localStorage.setItem("access", access);
        localStorage.setItem("refreshToken", refresh);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(setUser({ user, access, refresh }));
      }

      if (isLogin) {
        setMessage(`✅ Successfully logged in as ${user?.email || formData.email}`);
        setTimeout(() => navigate("/home"), 500);
      } else {
        setMessage(
          `✅ Registration successful for ${user?.username || formData.name}.
           Please log in
           `
          //  Email: ${formData.email}
          //  Password: ${formData.password}
        );
        // Switch to login form after showing credentials
        setTimeout(() => setIsLogin(true), 2000);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.response?.data?.email ||
        error.response?.data?.username ||
        "An unknown error occurred.";
      setMessage(`❌ Error: ${errorMsg}`);
      console.error("Authentication Error:", error.response);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    const theme = localStorage.getItem('theme')
    darkMode ? root.classList.add("dark") : root.classList.remove("dark");
    theme==="dark" ? root.classList.add("dark"):root.classList.remove("dark")
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg transition-colors duration-700 p-6">
      <h1 className="text-text text-5xl font-extrabold mb-6 select-none drop-shadow-md text-shadow-lg">
        VoxaChat
      </h1>

      <div className="absolute top-5 right-5">
        <DarkModeToggle />
      </div>

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

        {/* Styled Message */}
        {message && (
          <div
            className={`mt-4 text-center px-4 py-2 rounded-md font-medium shadow-md transition-all duration-500 whitespace-pre-line
              ${message.startsWith("✅")
                ? "bg-green-100 text-green-700 border border-green-400"
                : "bg-red-100 text-red-700 border border-red-400"}`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
 

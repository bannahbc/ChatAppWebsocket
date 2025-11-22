// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// function Logout() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Clear tokens
//     localStorage.removeItem("access");
//     localStorage.removeItem("refresh");

//     // Optionally clear other user data
//     localStorage.removeItem("user");

//     // Redirect to login
//     navigate("/", { replace: true });
//   }, [navigate]);

//   return null; // No UI needed, just performs logout
// }

// export default Logout;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../Store/authSlice"; // adjust path

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch Redux logout
    dispatch(logout());

    // Redirect to login
    navigate("/", { replace: true });
  }, [dispatch, navigate]);

  return null; // No UI needed, just performs logout
}

export default Logout;


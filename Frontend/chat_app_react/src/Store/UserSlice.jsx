// src/store/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Hydrate from localStorage on app start
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  access: localStorage.getItem("access") || null,
  refresh: localStorage.getItem("refresh") || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;

      // Persist to localStorage
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("access", action.payload.access);
      localStorage.setItem("refresh", action.payload.refresh);
    },

    // 🎯 NEW REDUCER FOR PROFILE PICTURE UPDATE
    updateProfilePicture: (state, action) => {
      const newPicUrl = action.payload; // Assuming payload is the new URL string

      if (state.user) {
        // 1. Update the Redux state
        state.user.profile_picture = newPicUrl;

        // 2. Update localStorage (Crucial for persistence!)
        // Get the current user data from localStorage, update it, and set it back.
        try {
          const userString = localStorage.getItem("user");
          if (userString) {
            const userInStorage = JSON.parse(userString);
            userInStorage.profile_picture = newPicUrl;
            localStorage.setItem("user", JSON.stringify(userInStorage));
          }
        } catch (e) {
          console.error("Could not update profile picture in localStorage:", e);
        }
      }
    },
    // ------------------------------------------

    clearUser: (state) => {
      state.user = null;
      state.access = null;
      state.refresh = null;

      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    },
  },
});

export const { setUser, clearUser,updateProfilePicture } = userSlice.actions;
export default userSlice.reducer;

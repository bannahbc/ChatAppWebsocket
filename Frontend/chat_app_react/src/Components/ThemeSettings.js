// src/components/ThemeSettings.jsx
import React, { useEffect, useState } from "react";
import tinycolor from "tinycolor2";

const applyTheme = (baseColor) => {
  const color = tinycolor(baseColor);

  // Light theme overrides
  document.documentElement.style.setProperty("--color-primary", baseColor);
  document.documentElement.style.setProperty("--color-primary-dark", color.darken(15).toString());
  document.documentElement.style.setProperty("--color-accent", color.lighten(20).toString());
  document.documentElement.style.setProperty("--color-accent-dark", color.darken(25).toString());
  document.documentElement.style.setProperty("--color-border", color.lighten(40).toString());
  document.documentElement.style.setProperty("--color-bg", "#FAF4EF");
  document.documentElement.style.setProperty("--color-text", "#111827");

  // Dark theme overrides
  const darkRoot = document.querySelector(".dark");
  if (darkRoot) {
    darkRoot.style.setProperty("--color-primary", baseColor);
    darkRoot.style.setProperty("--color-primary-dark", color.darken(15).toString());
    darkRoot.style.setProperty("--color-accent", color.lighten(20).toString());
    darkRoot.style.setProperty("--color-accent-dark", color.darken(25).toString());
    darkRoot.style.setProperty("--color-border", color.darken(40).toString());
    darkRoot.style.setProperty("--color-bg", "#111827");
    darkRoot.style.setProperty("--color-text", "#F9FAFB");
  }
};

export const ThemeSettings = () => {
  const [baseColor, setBaseColor] = useState("#A47764");

  useEffect(() => {
    const savedColor = localStorage.getItem("baseColor");
    if (savedColor) {
      setBaseColor(savedColor);
      applyTheme(savedColor);
    }
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setBaseColor(value);
    applyTheme(value);
    localStorage.setItem("baseColor", value);
  };

  return (
    <div className="p-4 space-y-4 bg-[var(--color-glass)] rounded-lg shadow-md">
      <h2 className="font-bold text-lg text-[var(--color-text)]">Theme Settings</h2>
      <div className="flex items-center gap-3">
        <label className="text-[var(--color-text)]">Base Color:</label>
        <input
          type="color"
          value={baseColor}
          onChange={handleChange}
          className="w-12 h-12 cursor-pointer border border-[var(--color-border)] rounded-md"
        />
      </div>
    </div>
  );
};


// // src/components/ThemeSettings.jsx  this is the change dark or light acc to the base color
// import React, { useEffect, useState } from "react";
// import tinycolor from "tinycolor2";

// const applyTheme = (baseColor) => {
//   const color = tinycolor(baseColor);
//   const isLight = color.isLight();

//   // Toggle dark class on <html>
//   if (isLight) {
//     document.documentElement.classList.remove("dark");
//   } else {
//     document.documentElement.classList.add("dark");
//   }

//   // Apply variables depending on mode
//   if (document.documentElement.classList.contains("dark")) {
//     // Dark theme
//     document.documentElement.style.setProperty("--color-primary", baseColor);
//     document.documentElement.style.setProperty("--color-primary-dark", color.darken(15).toString());
//     document.documentElement.style.setProperty("--color-accent", color.lighten(20).toString());
//     document.documentElement.style.setProperty("--color-accent-dark", color.darken(25).toString());
//     document.documentElement.style.setProperty("--color-border", color.darken(40).toString());
//     document.documentElement.style.setProperty("--color-bg", "#111827");
//     document.documentElement.style.setProperty("--color-text", "#F9FAFB");
//   } else {
//     // Light theme
//     document.documentElement.style.setProperty("--color-primary", baseColor);
//     document.documentElement.style.setProperty("--color-primary-dark", color.darken(15).toString());
//     document.documentElement.style.setProperty("--color-accent", color.lighten(20).toString());
//     document.documentElement.style.setProperty("--color-accent-dark", color.darken(25).toString());
//     document.documentElement.style.setProperty("--color-border", color.lighten(40).toString());
//     document.documentElement.style.setProperty("--color-bg", "#FAF4EF");
//     document.documentElement.style.setProperty("--color-text", "#111827");
//   }
// };

// export const ThemeSettings = () => {
//   const [baseColor, setBaseColor] = useState("#A47764");

//   useEffect(() => {
//     const savedColor = localStorage.getItem("baseColor");
//     if (savedColor) {
//       setBaseColor(savedColor);
//       applyTheme(savedColor);
//     }
//   }, []);

//   const handleChange = (e) => {
//     const value = e.target.value;
//     setBaseColor(value);
//     applyTheme(value);
//     localStorage.setItem("baseColor", value);
//   };

//   return (
//     <div className="p-4 space-y-4 bg-[var(--color-glass)] rounded-lg shadow-md">
//       <h2 className="font-bold text-lg text-[var(--color-text)]">Theme Settings</h2>
//       <div className="flex items-center gap-3">
//         <label className="text-[var(--color-text)]">Base Color:</label>
//         <input
//           type="color"
//           value={baseColor}
//           onChange={handleChange}
//           className="w-12 h-12 cursor-pointer border border-[var(--color-border)] rounded-md"
//         />
//       </div>
//     </div>
//   );
// };

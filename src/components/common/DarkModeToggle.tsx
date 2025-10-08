import React, { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider"

const DarkModeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() =>
    localStorage.getItem("theme") === "dark"
  );
  const { setTheme } = useTheme()

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
        setTheme("dark")
    //   root.classList.add("dark");
    //   localStorage.setItem("theme", "dark");
    } else {
        setTheme("light")
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <button
      onClick={toggleDarkMode}
      className={`p-2 rounded ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
      }`}
    >
      {isDarkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
};

export default DarkModeToggle;

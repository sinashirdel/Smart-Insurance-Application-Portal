import { createContext, useContext, useState, useEffect } from "react";
import { ConfigProvider, theme } from "antd";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "system";
  });

  const isDarkMode =
    themeMode === "dark" ||
    (themeMode === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    localStorage.setItem("theme", themeMode);
  }, [themeMode]);

  const setTheme = (mode) => {
    setThemeMode(mode);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, setTheme, isDarkMode }}>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: "#1677ff",
          },
        }}
      >
        <div
          className={`app-wrapper ${isDarkMode ? "dark-theme" : "light-theme"}`}
        >
          {children}
        </div>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

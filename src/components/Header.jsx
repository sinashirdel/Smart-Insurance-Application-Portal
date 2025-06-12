"use client";
import { FileText, List, Save, Home, Moon, Sun, Monitor } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Space, Button, Select } from "antd";
import { useTheme } from "../context/ThemeContext";
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const { themeMode, setTheme } = useTheme();

  const menu = [
    { id: 1, name: "Home", icon: <Home size={20} />, url: "/" },
    {
      id: 2,
      name: "Forms",
      icon: <FileText size={20} />,
      url: "/new-application",
    },
    { id: 3, name: "Drafts", icon: <Save size={20} />, url: "/drafts" },
    {
      id: 4,
      name: "Applications",
      icon: <List size={20} />,
      url: "/applications",
    },
  ];

  const themeOptions = [
    { value: "system", label: "System", icon: <Monitor size={16} /> },
    { value: "light", label: "Light", icon: <Sun size={16} /> },
    { value: "dark", label: "Dark", icon: <Moon size={16} /> },
  ];

  return (
    <div className="header-container">
      <div className="header-menu">
        {menu.map((item) => (
          <Link
            to={item.url}
            key={item.id}
            className={`menu-item ${
              location.pathname === item.url ? "active" : ""
            }`}
          >
            <span>{item.icon}</span>
            <span
              className={location.pathname === item.url ? "visible" : "hidden"}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </div>
      <Select
        value={themeMode}
        onChange={setTheme}
        options={themeOptions}
        className="theme-select"
        style={{ width: 120 }}
        optionLabelProp="label"
        optionRender={(option) => (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {option.data.icon}
            <span>{option.data.label}</span>
          </div>
        )}
      />
    </div>
  );
};

export default Header;

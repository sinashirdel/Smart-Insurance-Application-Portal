"use client";
import { FileText, List, Save, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

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

  return (
    <div className="!w-full md:!py-6 !py-4 max-md:!px-4 !sticky !inset-0 !z-30 !backdrop-blur-md !bg-zinc-100/30 !border-b-[1px] !border-zinc-200">
      <div className="md:!w-fit !w-full !p-2 !bg-white !rounded-full !flex !justify-around md:!grid !grid-cols-4 md:!grid-cols-[repeat(4,200px)] !items-center !justify-self-center">
        {menu.map((item) => (
          <Link
            to={item.url}
            key={item.id}
            className={`!flex !gap-2 !flex-1 !items-center !justify-center !text-xs lg:!text-base !hover:text-zinc-800 !transition-all ${
              location.pathname === item.url
                ? "!bg-zinc-100 !text-zinc-800 !hover:bg-zinc-300/60"
                : "!text-zinc-500"
            }  md:!py-3 md:!px-4 !py-[6px] !px-[12px] !rounded-full`}
          >
            <span>{item.icon}</span>
            <span
              className={`${
                location.pathname === item.url ? "!block" : "!hidden md:!block"
              }`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Header;

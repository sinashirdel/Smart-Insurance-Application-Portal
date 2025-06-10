import { Layout, Menu } from "antd";
import { FileText, List } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const { Header: AntHeader } = Layout;

const Header = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: "/",
      icon: <FileText size={18} />,
      label: <Link to="/">Insurance Forms</Link>,
    },
    {
      key: "/applications",
      icon: <List size={18} />,
      label: <Link to="/applications">Applications</Link>,
    },
  ];

  return (
    <AntHeader className="w-full px-80 flex items-center shadow-sm">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xl font-semibold text-gray-800">
          Smart Insurance Portal
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="border-0 w-full md:w-auto"
        />
      </div>
    </AntHeader>
  );
};

export default Header;

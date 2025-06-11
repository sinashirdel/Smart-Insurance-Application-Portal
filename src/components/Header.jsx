import { Layout, Segmented } from "antd";
import { FileText, List } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const { Header: AntHeader } = Layout;

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const options = [
    {
      value: "/",
      label: (
        <div className="flex items-center gap-2">
          <FileText size={16} />
          <span>Insurance Forms</span>
        </div>
      ),
    },
    {
      value: "/applications",
      label: (
        <div className="flex items-center gap-2">
          <List size={16} />
          <span>Applications</span>
        </div>
      ),
    },
  ];

  return (
    <AntHeader className="!w-full !px-4 sm:!px-6 md:!px-8 lg:!px-16 !flex !items-center !justify-between bg-white border-b border-gray-100 !h-auto !py-4 !sticky !top-0 !z-[1000000] !shadow-md">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-lg md:text-xl font-medium text-gray-900">
          Smart Insurance Portal
        </div>
        <Segmented
          value={location.pathname}
          onChange={(value) => navigate(value)}
          options={options}
          className="md:!w-auto [&_.ant-segmented-item]:!flex [&_.ant-segmented-item]:!items-center [&_.ant-segmented-item]:!justify-center"
          style={{
            "--ant-segmented-item-selected-bg": "#f0f7ff",
            "--ant-segmented-item-selected-color": "#1677ff",
          }}
        />
      </div>
    </AntHeader>
  );
};

export default Header;

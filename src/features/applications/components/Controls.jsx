import React from "react";
import { Space, Button, Input, Popover } from "antd";
import { Settings2, Search } from "lucide-react";
import ColumnSettings from "./ColumnSettings";

const Controls = ({
  searchText,
  onSearchChange,
  columns,
  visibleColumns,
  onColumnToggle,
}) => {
  const columnSettings = (
    <ColumnSettings
      columns={columns}
      visibleColumns={visibleColumns}
      onColumnToggle={onColumnToggle}
    />
  );

  return (
    <>
      <div className="desktop-controls">
        <Space className="controls-space">
          <Input
            placeholder="Search..."
            prefix={<Search size={16} />}
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
            allowClear
          />
          <Popover
            content={columnSettings}
            title="Column Settings"
            trigger="click"
            placement="bottomRight"
          >
            <Button icon={<Settings2 size={16} />}>Columns</Button>
          </Popover>
        </Space>
      </div>
      <div className="mobile-controls">
        <Space className="controls-space" direction="vertical" size="small">
          <Input
            placeholder="Search..."
            prefix={<Search size={16} />}
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
            allowClear
          />
          <Popover
            content={columnSettings}
            title="Column Settings"
            trigger="click"
            placement="bottomRight"
          >
            <Button icon={<Settings2 size={16} />}>Columns</Button>
          </Popover>
        </Space>
      </div>
    </>
  );
};

export default Controls;

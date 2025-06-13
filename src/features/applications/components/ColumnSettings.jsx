import React from "react";
import { Space, Checkbox } from "antd";

const ColumnSettings = ({ columns, visibleColumns, onColumnToggle }) => {
  return (
    <div className="column-settings">
      <Space direction="vertical">
        {columns.map((column) => (
          <Checkbox
            key={column}
            checked={visibleColumns.includes(column)}
            onChange={() => onColumnToggle(column)}
          >
            {column}
          </Checkbox>
        ))}
      </Space>
    </div>
  );
};

export default ColumnSettings;

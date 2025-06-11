import { useState, useEffect } from "react";
import { Table, Card, Button, Space, Popover, Checkbox, Input } from "antd";
import { Settings2, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ApplicationsList = () => {
  const [columns, setColumns] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [searchText, setSearchText] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const response = await axios.get(
        "https://assignment.devotel.io/api/insurance/forms/submissions"
      );
      setColumns(response.data.columns);
      setVisibleColumns(response.data.columns);
      return response.data;
    },
  });

  const handleColumnToggle = (column) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const columnSettings = (
    <div className="p-4">
      <Space direction="vertical">
        {columns.map((column) => (
          <Checkbox
            key={column}
            checked={visibleColumns.includes(column)}
            onChange={() => handleColumnToggle(column)}
          >
            {column}
          </Checkbox>
        ))}
      </Space>
    </div>
  );

  const tableColumns = visibleColumns.map((column) => ({
    title: column,
    dataIndex: column,
    key: column,
    sorter: (a, b) => {
      if (typeof a[column] === "string") {
        return a[column].localeCompare(b[column]);
      }
      return a[column] - b[column];
    },
  }));

  const filteredData =
    data?.data?.filter((record) => {
      if (!searchText) return true;

      return visibleColumns.some((column) => {
        const value = record[column];
        if (value == null) return false;
        return value
          .toString()
          .toLowerCase()
          .includes(searchText.toLowerCase());
      });
    }) || [];

  return (
    <Card
      title="Applications"
      className="w-full"
      extra={
        <div className="hidden md:block">
          <Space className="w-full">
            <Input
              placeholder="Search..."
              prefix={<Search size={16} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="!w-full"
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
      }
    >
      <div className="md:hidden mb-4">
        <Space className="w-full" direction="vertical" size="small">
          <Input
            placeholder="Search..."
            prefix={<Search size={16} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="!w-full"
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
      <Table
        columns={tableColumns}
        dataSource={filteredData}
        loading={isLoading}
        rowKey="id"
        scroll={{ x: "max-content" }}
        className="w-full"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
          responsive: true,
        }}
      />
    </Card>
  );
};

export default ApplicationsList;

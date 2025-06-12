import React, { useState, useEffect, useContext, useMemo } from "react";
import { Table, Card, Button, Space, Popover, Checkbox, Input } from "antd";
import { Settings2, Search, GripVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const RowContext = React.createContext({});

const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<GripVertical size={16} />}
      style={{ cursor: "move" }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

const ApplicationsList = () => {
  const [columns, setColumns] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState([]);

  const { data: apiData, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const response = await axios.get(
        "https://assignment.devotel.io/api/insurance/forms/submissions"
      );
      setColumns(response.data.columns);
      setVisibleColumns(response.data.columns);
      setDataSource(
        response.data.data.map((item, index) => ({
          ...item,
          key: item.id || `row-${index}`,
        }))
      );
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

  const Row = (props) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: props["data-row-key"] || props.key,
    });

    const style = {
      ...props.style,
      transform: CSS.Translate.toString(transform),
      transition,
      ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
    };

    const contextValue = useMemo(
      () => ({ setActivatorNodeRef, listeners }),
      [setActivatorNodeRef, listeners]
    );

    return (
      <RowContext.Provider value={contextValue}>
        <tr {...props} ref={setNodeRef} style={style} {...attributes} />
      </RowContext.Provider>
    );
  };

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setDataSource((prevState) => {
        const activeIndex = prevState.findIndex(
          (record) => record.key === active.id
        );
        const overIndex = prevState.findIndex(
          (record) => record.key === over.id
        );
        return arrayMove(prevState, activeIndex, overIndex);
      });
    }
  };

  const tableColumns = [
    {
      key: "sort",
      align: "center",
      width: 80,
      render: () => <DragHandle />,
    },
    ...visibleColumns.map((column) => ({
      title: column,
      dataIndex: column,
      key: column,
      sorter: (a, b) => {
        if (typeof a[column] === "string") {
          return a[column].localeCompare(b[column]);
        }
        return a[column] - b[column];
      },
      render: (text) => {
        if (text === null || text === undefined) return "-";
        if (typeof text === "object") return JSON.stringify(text);
        return text;
      },
    })),
  ];

  const filteredData = dataSource.filter((record) => {
    if (!searchText) return true;

    return visibleColumns.some((column) => {
      const value = record[column];
      if (value == null) return false;
      return value.toString().toLowerCase().includes(searchText.toLowerCase());
    });
  });

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
      <DndContext
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        onDragEnd={onDragEnd}
        collisionDetection={closestCenter}
      >
        <SortableContext
          items={filteredData.map((i) => i.key)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            columns={tableColumns}
            dataSource={filteredData}
            loading={isLoading}
            rowKey="key"
            scroll={{ x: "max-content" }}
            className="w-full"
            components={{ body: { row: Row } }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`,
              responsive: true,
            }}
          />
        </SortableContext>
      </DndContext>
    </Card>
  );
};

export default ApplicationsList;

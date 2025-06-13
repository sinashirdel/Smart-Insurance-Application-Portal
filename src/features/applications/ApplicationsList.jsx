import React, { useState, useEffect, useContext, useMemo } from "react";
import { Table, Card } from "antd";
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
import Controls from "./components/Controls";
import DragHandle from "./components/DragHandle";
import "./ApplicationsList.css";

export const RowContext = React.createContext({});

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
    setVisibleColumns((prev) => {
      if (prev.includes(column)) {
        // Remove the column
        return prev.filter((col) => col !== column);
      } else {
        // Find the index of the column in the original columns array
        const originalIndex = columns.findIndex((col) => col === column);
        // Create a new array with the column inserted at its original position
        const newVisibleColumns = [...prev];
        newVisibleColumns.splice(originalIndex, 0, column);
        return newVisibleColumns;
      }
    });
  };

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
    <Card className="applications-card">
      <div className="card-header">
        <h2>Applications</h2>
        <Controls
          searchText={searchText}
          onSearchChange={setSearchText}
          columns={columns}
          visibleColumns={visibleColumns}
          onColumnToggle={handleColumnToggle}
        />
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
            className="applications-table"
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

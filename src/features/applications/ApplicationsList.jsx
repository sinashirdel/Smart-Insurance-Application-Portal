import React, { useEffect, useState, useRef } from "react";
import { Table, Card } from "antd";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Sortable from "sortablejs";
import { GripVertical } from "lucide-react";
import Controls from "./components/Controls";
import "./ApplicationsList.css";

const ApplicationsList = () => {
  const [columns, setColumns] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const scrollRef = useRef(null);

  const { isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const response = await axios.get(
        "https://assignment.devotel.io/api/insurance/forms/submissions"
      );
      const dataWithKeys = response.data.data.map((item, index) => ({
        ...item,
        key: item.id || `row-${index}`,
      }));
      setColumns(response.data.columns);
      setVisibleColumns(response.data.columns);
      setDataSource(dataWithKeys);
      return response.data;
    },
  });

  useEffect(() => {
    const tableBody = scrollRef.current?.querySelector("tbody");
    if (!tableBody) return;

    const sortable = Sortable.create(tableBody, {
      animation: 150,
      handle: ".drag-handle",
      ghostClass: "sortable-ghost",
      fallbackOnBody: false,
      swapThreshold: 0.6,

      onStart: (evt) => {
        if (!evt.originalEvent.target.closest(".drag-handle")) {
          sortable.cancel();
        }
      },

      onMove: (evt) => {
        if (evt.to !== tableBody) {
          return false;
        }
        return true;
      },

      onEnd: (evt) => {
        const { oldIndex, newIndex, from, to, item } = evt;

        if (newIndex == null || to !== from) {
          if (from) {
            from.insertBefore(item, from.children[oldIndex] || null);
          }
          const ghosts = from.querySelectorAll(".sortable-ghost");
          ghosts.forEach((ghost) => ghost.remove());
          return;
        }

        if (oldIndex === newIndex) return;

        const newData = [...dataSource];
        const [removed] = newData.splice(oldIndex, 1);
        newData.splice(newIndex, 0, removed);
        setDataSource(newData);
      },
    });

    return () => {
      sortable.destroy();
    };
  }, [dataSource]);

  const handleColumnToggle = (column) => {
    setVisibleColumns((prev) => {
      if (prev.includes(column)) {
        return prev.filter((col) => col !== column);
      } else {
        const originalIndex = columns.findIndex((col) => col === column);
        const newVisibleColumns = [...prev];
        newVisibleColumns.splice(originalIndex, 0, column);
        return newVisibleColumns;
      }
    });
  };

  const filteredData = dataSource.filter((record) => {
    if (!searchText) return true;
    return visibleColumns.some((column) => {
      const value = record[column];
      if (value == null) return false;
      return value.toString().toLowerCase().includes(searchText.toLowerCase());
    });
  });

  const tableColumns = [
    {
      key: "drag",
      width: 40,
      render: () => (
        <span
          className="drag-handle"
          style={{ cursor: "move", userSelect: "none" }}
        >
          <GripVertical size={16} />
        </span>
      ),
    },
    ...visibleColumns.map((column) => ({
      title: column,
      dataIndex: column,
      key: column,
      render: (text) => {
        if (text === null || text === undefined) return "-";
        if (typeof text === "object") return JSON.stringify(text);
        return text;
      },
    })),
  ];

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

      <div ref={scrollRef}>
        <Table
          columns={tableColumns}
          dataSource={filteredData}
          loading={isLoading}
          rowKey="key"
          // scroll={{ x: "max-content" }}
          style={{
            overflowX: "auto",
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </div>
    </Card>
  );
};

export default ApplicationsList;

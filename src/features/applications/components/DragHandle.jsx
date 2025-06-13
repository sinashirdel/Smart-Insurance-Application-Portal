import React, { useContext } from "react";
import { Button } from "antd";
import { GripVertical } from "lucide-react";
import { RowContext } from "../ApplicationsList";

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

export default DragHandle;

import React, { useState, useCallback, useEffect } from "react";
import { Selection } from "../types";
import { css } from "@emotion/css";

const deleteButton = css`
  display: flex;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0px;
  right: -40px;
  cursor: pointer;
  background-color: #fafafa;
  color: #9c9d99;
  border-radius: 5px;
  border: none;
  box-shadow: 0 2px 5px 2px #78787857;
  svg {
    height: 26px;
  }
`;

const indexButton = css`
  display: flex;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 4px;
  left: 4px;
  cursor: pointer;
  background-color: #ffffff94;
  color: black;
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 5px 2px #78787857;
  svg {
    height: 26px;
  }
`;

interface Props {
  selection: Selection;
  onDelete: () => void;
  onUpdate: (selection: Selection) => void;
}

const SelectionBox: React.FC<Props> = ({ selection, onDelete, onUpdate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, action: "drag" | "resize", handle?: string) => {
      e.stopPropagation();
      if (action === "drag") {
        setIsDragging(true);
      } else {
        setIsResizing(true);
        setResizeHandle(handle || null);
      }
      setIsActive(true);
    },
    [],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const dx = e.movementX;
      const dy = e.movementY;

      if (isDragging) {
        onUpdate({
          ...selection,
          x: selection.x + dx,
          y: selection.y + dy,
        });
      } else if (isResizing && resizeHandle) {
        const newSelection = { ...selection };
        switch (resizeHandle) {
          case "n":
            newSelection.y += dy;
            newSelection.height -= dy;
            break;
          case "s":
            newSelection.height += dy;
            break;
          case "w":
            newSelection.x += dx;
            newSelection.width -= dx;
            break;
          case "e":
            newSelection.width += dx;
            break;
          case "nw":
            newSelection.x += dx;
            newSelection.y += dy;
            newSelection.width -= dx;
            newSelection.height -= dy;
            break;
          case "ne":
            newSelection.y += dy;
            newSelection.width += dx;
            newSelection.height -= dy;
            break;
          case "sw":
            newSelection.x += dx;
            newSelection.width -= dx;
            newSelection.height += dy;
            break;
          case "se":
            newSelection.width += dx;
            newSelection.height += dy;
            break;
        }
        onUpdate(newSelection);
      }
    },
    [isDragging, isResizing, resizeHandle, selection, onUpdate],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
    setIsActive(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handles = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

  return (
    <div
      style={{
        position: "absolute",
        left: `${selection.x}px`,
        top: `${selection.y}px`,
        width: `${selection.width}px`,
        height: `${selection.height}px`,
        border: isActive ? "2px dashed #1569df" : "2px solid #1569df",
        cursor: isDragging ? "move" : "default",
        userSelect: "none",
        zIndex: 11,
      }}
      onMouseDown={(e) => handleMouseDown(e, "drag")}
    >
      <div className={indexButton}> {selection.index + 1}</div>
      <button className={deleteButton} onClick={onDelete}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>
      {handles.map((handle) => (
        <div
          key={handle}
          className={`resize-handle ${handle}`}
          style={{
            position: "absolute",
            width: "8px",
            height: "8px",
            background: "#1569df",
            ...getHandlePosition(handle),
          }}
          onMouseDown={(e) => handleMouseDown(e, "resize", handle)}
        />
      ))}
    </div>
  );
};

function getHandlePosition(handle: string) {
  switch (handle) {
    case "n":
      return { top: "-5px", left: "calc(50% - 5px)", cursor: "ns-resize" };
    case "s":
      return { bottom: "-5px", left: "calc(50% - 5px)", cursor: "ns-resize" };
    case "w":
      return { left: "-5px", top: "calc(50% - 5px)", cursor: "ew-resize" };
    case "e":
      return { right: "-5px", top: "calc(50% - 5px)", cursor: "ew-resize" };
    case "nw":
      return { top: "-5px", left: "-5px", cursor: "nwse-resize" };
    case "ne":
      return { top: "-5px", right: "-5px", cursor: "nesw-resize" };
    case "sw":
      return { bottom: "-5px", left: "-5px", cursor: "nesw-resize" };
    case "se":
      return { bottom: "-5px", right: "-5px", cursor: "nwse-resize" };
  }
}

export default SelectionBox;

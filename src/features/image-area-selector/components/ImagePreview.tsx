import React, { useState, useRef, useCallback, useEffect } from "react";
import { Selection } from "../types";
import { createSelection, isValidSelection } from "../utils/selectionUtils";
import SelectionBox from "./SelectionBox";
import { css } from "@emotion/css";

const imagePreviewContainer = css`
  position: relative;
`;

const imagePreviewImage = css`
  width: 355px;
  height: auto;
  cursor: pointer;
  border-radius: 15px;
  user-select: none;
`;

const imagePreviewCanvas = css`
  position: absolute;
  top: 0;
  left: 0;
  cursor: crosshair;
`;

interface ImagePreviewProps {
  image: string;
  selections: Selection[];
  onSelectionsChange: (selections: Selection[]) => void;
}

const ImagePreview = ({
  image,
  selections,
  onSelectionsChange,
}: ImagePreviewProps) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateCanvasSize = () => {
      if (imageRef.current) {
        setCanvasSize({
          width: imageRef.current.width,
          height: imageRef.current.height,
        });
      }
    };

    const image = imageRef.current;
    if (image) {
      image.addEventListener("load", updateCanvasSize);
      updateCanvasSize(); // initial call to set initial size
    }

    return () => {
      if (image) {
        image.removeEventListener("load", updateCanvasSize);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [selections, canvasSize]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsSelecting(true);
    setStartPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSelecting || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const endPos = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };

    // Clear previous rectangle
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw new rectangle
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      startPos.x,
      startPos.y,
      endPos.x - startPos.x,
      endPos.y - startPos.y,
    );
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSelecting || !imageRef.current) return;

    const endPos = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    const newSelection = createSelection(startPos, endPos, selections.length);
    if (
      isValidSelection(
        newSelection,
        imageRef.current.width,
        imageRef.current.height,
        selections,
      )
    ) {
      onSelectionsChange([...selections, newSelection]);
    }

    setIsSelecting(false);

    // clear canvas
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSelectionUpdateConstrained = useCallback(
    (index: number, updatedSelection: Selection) => {
      if (imageRef.current) {
        const imageRect = imageRef.current.getBoundingClientRect();
        const constrainedSelection = {
          ...updatedSelection, // keep original values including index
          x: Math.max(
            0,
            Math.min(
              updatedSelection.x,
              imageRect.width - updatedSelection.width,
            ),
          ),
          y: Math.max(
            0,
            Math.min(
              updatedSelection.y,
              imageRect.height - updatedSelection.height,
            ),
          ),
          width: Math.min(
            updatedSelection.width,
            imageRect.width - updatedSelection.x,
          ),
          height: Math.min(
            updatedSelection.height,
            imageRect.height - updatedSelection.y,
          ),
        };

        if (
          isValidSelection(
            constrainedSelection,
            imageRect.width,
            imageRect.height,
            selections.filter((_, i) => i !== index),
          )
        ) {
          const newSelections = [...selections];
          newSelections[index] = constrainedSelection;
          onSelectionsChange(newSelections);
        }
      }
    },
    [selections, onSelectionsChange],
  );

  return (
    <div className={imagePreviewContainer}>
      <img
        ref={imageRef}
        src={image}
        alt="Uploaded"
        className={imagePreviewImage}
      />
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className={imagePreviewCanvas}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      {selections.map((selection, index) => (
        <SelectionBox
          key={index}
          selection={selection}
          onDelete={() => {
            const newSelections = selections.filter((_, i) => i !== index);
            onSelectionsChange(newSelections);
          }}
          onUpdate={(updatedSelection) =>
            handleSelectionUpdateConstrained(index, updatedSelection)
          }
        />
      ))}
    </div>
  );
};

export default ImagePreview;

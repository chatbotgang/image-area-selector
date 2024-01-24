import { FC, MouseEvent, useRef, useState } from "react";
import { Dir, useStore } from "../hooks/store";

interface Position {
  x: number;
  y: number;
}

export interface RectInfo {
  x: number;
  y: number;
  width: number;
  height: number;
}

const WRAPPER_WIDTH: number = 355;
const WRAPPER_HEIGHT: number = 156;
const MIN_WIDTH = 10;
const MIN_HEIGHT = 10;

const RectBlock: FC<{
  onDel: (info: RectInfo) => void;
  control: boolean;
  index: number;
}> = ({ onDel, control, index }) => {
  const [rects] = useStore((store) => store.rects);
  const [, setResizing] = useStore((store) => store.resizingInfo);
  const handleDel = (e: MouseEvent) => {
    e.stopPropagation();
    onDel(rects[index]);
  };
  const handleResizeMouseDown = (direction: Dir, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("resizing trigger");
    setResizing({ resizingInfo: { trigger: true, id: index, dir: direction } });
  };
  return (
    <div
      className="absolute border-2"
      style={{
        left: rects[index].x,
        top: rects[index].y,
        width: rects[index].width,
        height: rects[index].height,
      }}
    >
      <div
        className={`absolute flex justify-center items-center p-3 w-4 h-4 rounded-lg bg-gray-200 hover:shadow-sm hover:bg-red-400 cursor-pointer ${
          control && `hidden`
        }`}
        style={{ right: -32, top: -8 }}
        onClick={handleDel}
      >
        <span>X</span>
      </div>
      <div
        className={`absolute w-2 h-2 bg-blue-500 cursor-nwse-resize ${
          control && `hidden`
        }`}
        style={{ right: -5, bottom: -5 }}
        onMouseDown={(e) => handleResizeMouseDown(Dir.BOTTOM_RIGHT, e)}
      ></div>
      <div
        className={`absolute w-2 h-2 bg-blue-500 cursor-nesw-resize ${
          control && `hidden`
        }`}
        style={{ right: -5, top: -5 }}
        onMouseDown={(e) => handleResizeMouseDown(Dir.TOP_RIGHT, e)}
      ></div>
      <div
        className={`absolute w-2 h-2 bg-blue-500 cursor-nesw-resize ${
          control && `hidden`
        }`}
        style={{ left: -5, bottom: -5 }}
        onMouseDown={(e) => handleResizeMouseDown(Dir.BOTTOM_LEFT, e)}
      ></div>
      <div
        className={`absolute w-2 h-2 bg-blue-500 cursor-nwse-resize ${
          control && `hidden`
        }`}
        style={{ left: -5, top: -5 }}
        onMouseDown={(e) => handleResizeMouseDown(Dir.TOP_LEFT, e)}
      ></div>
      <div
        className={`absolute w-2 h-2 bg-blue-500 cursor-ns-resize left-1/2 ${
          control && `hidden`
        }`}
        style={{ top: -5 }}
        onMouseDown={(e) => handleResizeMouseDown(Dir.TOP, e)}
      ></div>
      <div
        className={`absolute w-2 h-2 bg-blue-500 cursor-ns-resize left-1/2 ${
          control && `hidden`
        }`}
        style={{ bottom: -5 }}
        onMouseDown={(e) => handleResizeMouseDown(Dir.BOTTOM, e)}
      ></div>
      <div
        className={`absolute w-2 h-2 bg-blue-500 cursor-ew-resize top-1/2 ${
          control && `hidden`
        }`}
        style={{ left: -5 }}
        onMouseDown={(e) => handleResizeMouseDown(Dir.LEFT, e)}
      ></div>
      <div
        className={`absolute w-2 h-2 bg-blue-500 cursor-ew-resize top-1/2 ${
          control && `hidden`
        }`}
        style={{ right: -5 }}
        onMouseDown={(e) => handleResizeMouseDown(Dir.RIGHT, e)}
      ></div>
    </div>
  );
};

const PreviewImg: FC<{ imgUrl: string }> = ({ imgUrl }) => {
  const [rects, setRects] = useStore((store) => store.rects);
  const [resizing, setResizing] = useStore((store) => store.resizingInfo);
  const [startPosition, setStartPosition] = useState<Position>({ x: 0, y: 0 });
  const [endPosition, setEndPosition] = useState<Position>({ x: 0, y: 0 });
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [isAddRect, setIsAddRect] = useState<boolean>(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  const handleAddRect = () => setIsAddRect(!isAddRect);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isAddRect && selectorRef.current) {
      console.log("trigger mouse Down!", isAddRect);
      setIsSelecting(true);
      const rect = selectorRef.current.getBoundingClientRect();
      setStartPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isAddRect) {
      if (!isSelecting || !selectorRef.current) return;
      const rect = selectorRef.current.getBoundingClientRect();
      setEndPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    if (resizing.trigger && resizing.id !== null && resizing.dir !== null) {
      const wrapperBounds = selectorRef.current?.getBoundingClientRect();
      const adjRects = rects.map((rect, idx) => {
        if (idx === resizing.id && wrapperBounds) {
          const newRect = { ...rect };
          let newWidth = newRect.width;
          let newHeight = newRect.height;
          let newX = newRect.x;
          let newY = newRect.y;
          console.log("default :", rect);
          switch (resizing.dir) {
            case Dir.BOTTOM_RIGHT:
              newWidth = Math.min(
                Math.max(e.clientX - newX, MIN_WIDTH),
                wrapperBounds.right - newX,
              );
              newHeight = Math.min(
                Math.max(e.clientY - newY, MIN_HEIGHT),
                wrapperBounds.bottom - newY,
              );
              break;
            case Dir.TOP_RIGHT:
              newWidth = Math.min(
                Math.max(e.clientX - newX, MIN_WIDTH),
                wrapperBounds.right - newX,
              );
              newHeight = Math.min(
                Math.max(newY + newHeight - e.clientY, MIN_HEIGHT),
                newY + newHeight - wrapperBounds.top,
              );
              newY = Math.max(wrapperBounds.top, newY + newHeight - newHeight);
              break;
            case Dir.BOTTOM_LEFT:
              newWidth = Math.min(
                Math.max(newX + newWidth - e.clientX, MIN_WIDTH),
                newX + newWidth - wrapperBounds.left,
              );
              newHeight = Math.min(
                Math.max(e.clientY - newY, MIN_HEIGHT),
                wrapperBounds.bottom - newY,
              );
              newX = Math.max(wrapperBounds.left, newX + newWidth - newWidth);
              break;
            case Dir.TOP_LEFT:
              newWidth = Math.min(
                Math.max(newX + newWidth - e.clientX, MIN_WIDTH),
                newX + newWidth - wrapperBounds.left,
              );
              newHeight = Math.min(
                Math.max(newY + newHeight - e.clientY, MIN_HEIGHT),
                newY + newHeight - wrapperBounds.top,
              );
              newX = Math.max(wrapperBounds.left, newX + newWidth - newWidth);
              newY = Math.max(wrapperBounds.top, newY + newHeight - newHeight);
              break;
            case Dir.TOP:
              newHeight = Math.min(
                Math.max(newY + newHeight - e.clientY, MIN_HEIGHT),
                newY + newHeight - wrapperBounds.top,
              );
              newY = Math.max(wrapperBounds.top, newY + newHeight - newHeight);
              break;
            case Dir.BOTTOM:
              newHeight = Math.min(
                Math.max(e.clientY - newY, MIN_HEIGHT),
                wrapperBounds.bottom - newY,
              );
              break;
            case Dir.LEFT:
              newWidth = Math.min(
                Math.max(newX + newWidth - e.clientX, MIN_WIDTH),
                newX + newWidth - wrapperBounds.left,
              );
              newX = Math.max(wrapperBounds.left, newX + newWidth - newWidth);
              break;
            case Dir.RIGHT:
              newWidth = Math.min(
                Math.max(e.clientX - newX, MIN_WIDTH),
                wrapperBounds.right - newX,
              );
              break;
          }
          return {
            ...newRect,
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
          };
        }
        return rect;
      });
      console.log("eventX :", e.clientX);
      console.log("adj arr: ", adjRects);
      setRects({ rects: adjRects });
    }
  };

  const checkOverlap = (rectA: RectInfo, rectB: RectInfo): boolean => {
    return !(
      rectA.x + rectA.width < rectB.x ||
      rectA.x > rectB.x + rectB.width ||
      rectA.y + rectA.height < rectB.y ||
      rectA.y > rectB.y + rectB.height
    );
  };

  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isAddRect && isSelecting) {
      const selectedRect: RectInfo = {
        x: Math.min(startPosition.x, endPosition.x),
        y: Math.min(startPosition.y, endPosition.y),
        width: Math.abs(endPosition.x - startPosition.x),
        height: Math.abs(endPosition.y - startPosition.y),
      };
      if (rects.length > 0) {
        const chkArr = rects
          .map((el) => checkOverlap(el, selectedRect))
          .filter((e) => e === true);
        if (chkArr.length > 0) {
          console.log("here");
          setIsSelecting(false);
        } else {
          setIsSelecting(false);
          setRects({ rects: [...rects, selectedRect] });
        }
      } else {
        setIsSelecting(false);
        setRects({ rects: [...rects, selectedRect] });
      }
    }
    if (resizing.trigger && resizing.id !== null && resizing.dir !== null) {
      setResizing({ resizingInfo: { trigger: false, id: null, dir: null } });
    }
  };

  const onRectDel = (info: RectInfo) => {
    const clearRects = rects.filter(
      (e) =>
        e.x !== info.x &&
        e.y !== info.y &&
        e.width !== info.width &&
        e.height !== info.height,
    );
    console.log("chk", clearRects);
    setRects({
      rects: clearRects,
    });
  };

  const selectionStyle = {
    left: Math.min(startPosition.x, endPosition.x),
    top: Math.min(startPosition.y, endPosition.y),
    width: Math.abs(endPosition.x - startPosition.x),
    height: Math.abs(endPosition.y - startPosition.y),
  };

  return (
    <div id="previewer">
      <div className="flex justify-center">
        <div
          className={`border-2 rounded-lg p-4 relative ${
            isAddRect && `cursor-crosshair`
          }`}
          style={{ width: WRAPPER_WIDTH, minHeight: WRAPPER_HEIGHT }}
          ref={selectorRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          // onDragStart={(e) => console.log("dragStart", e)}
        >
          {isSelecting && (
            <div
              style={{
                ...selectionStyle,
                position: "absolute",
                border: "1px dashed blue",
              }}
            ></div>
          )}
          {rects?.map((rect, idx) => (
            <RectBlock
              key={`${rect.x}-${idx}`}
              onDel={onRectDel}
              control={isAddRect}
              index={idx}
            />
          ))}
          <img
            src={imgUrl}
            alt="Image Preview"
            style={{
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              touchAction: "none",
            }}
          />
        </div>
      </div>
      <div className="flex justify-center items-center">
        <p className="text-lg bold mr-4">select area: </p>
        <button
          onClick={handleAddRect}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg my-2"
        >
          {isAddRect ? `stop add` : `add Rect`}
        </button>
      </div>
      <p>{JSON.stringify(rects)}</p>
    </div>
  );
};

export default PreviewImg;

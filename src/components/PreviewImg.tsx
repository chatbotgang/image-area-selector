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
        if (idx === resizing.id) {
          const newRect = { ...rect };
          // const analyzeX = Math.min(
          //   WRAPPER_WIDTH - newRect.x,
          //   Math.max(10, e.clientX - newRect.x),
          // );
          // const analyzeY = Math.max(10, e.clientY - newRect.y);
          let calcX = e.clientX - newRect.x;
          let calcY = e.clientY - newRect.y;

          calcX = Math.max(calcX, 10);
          calcY = Math.max(calcY, 10);
          if (wrapperBounds) {
            if (newRect.x + calcX > wrapperBounds.right) {
              calcX = wrapperBounds.right - newRect.x;
            }
            if (newRect.y + calcY > wrapperBounds.bottom) {
              calcY = wrapperBounds.bottom - newRect.y;
            }
          }
          // 更新矩形的尺寸
          // newRect.width = calcX;
          // newRect.height = calcY;
          console.log("default :", rect);
          switch (resizing.dir) {
            case Dir.BOTTOM_RIGHT:
              newRect.width = calcX;
              newRect.height = calcY;
              break;
            case Dir.TOP_RIGHT:
              newRect.width = calcX;
              newRect.height += newRect.y - e.clientY;
              newRect.y = e.clientY;
              break;
            case Dir.BOTTOM_LEFT:
              newRect.width += newRect.x - e.clientX;
              newRect.x = e.clientX;
              newRect.height = calcY;
              break;
            case Dir.TOP_LEFT:
              newRect.width += newRect.x - e.clientX;
              newRect.x = e.clientX;
              newRect.height += newRect.y - e.clientY;
              newRect.y = e.clientY;
              break;
            case Dir.TOP:
              newRect.height += newRect.y - e.clientY;
              newRect.y = e.clientY;
              break;
            case Dir.BOTTOM:
              newRect.height = calcY;
              break;
            case Dir.LEFT:
              newRect.width += newRect.x - e.clientX;
              newRect.x = e.clientX;
              break;
            case Dir.RIGHT:
              newRect.width = calcX;
              break;
          }
          return newRect;
        }
        return rect;
      });
      console.log("eventX :", e.clientX);
      console.log("adj arr: ", adjRects);
      setRects({ rects: adjRects });
    }
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
      setIsSelecting(false);
      setRects({ rects: [...rects, selectedRect] });
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
            style={{ width: "100%", height: "100%", pointerEvents: "none" }}
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
    </div>
  );
};

export default PreviewImg;

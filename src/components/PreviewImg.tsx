import { FC, MouseEvent, useRef, useState } from "react";
import { Dir, useStore } from "../hooks/store";

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
  const [addRectInfo, setAddRectInfo] = useStore((store) => store.addRectInfo);
  const [isAddRect, setIsAddRect] = useState<boolean>(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  const handleAddRect = () => setIsAddRect(!isAddRect);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isAddRect && selectorRef.current) {
      const rect = selectorRef.current.getBoundingClientRect();
      setAddRectInfo({
        addRectInfo: {
          ...addRectInfo,
          startPosition: { x: e.clientX - rect.left, y: e.clientY - rect.top },
          isSelecting: true,
        },
      });
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isAddRect) {
      if (!addRectInfo.isSelecting || !selectorRef.current) return;
      const rect = selectorRef.current.getBoundingClientRect();
      setAddRectInfo({
        addRectInfo: {
          ...addRectInfo,
          endPosition: { x: e.clientX - rect.left, y: e.clientY - rect.top },
        },
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
    if (isAddRect && addRectInfo.isSelecting) {
      const selectedRect: RectInfo = {
        x: Math.min(addRectInfo.startPosition.x, addRectInfo.endPosition.x),
        y: Math.min(addRectInfo.startPosition.y, addRectInfo.endPosition.y),
        width: Math.abs(
          addRectInfo.endPosition.x - addRectInfo.startPosition.x,
        ),
        height: Math.abs(
          addRectInfo.endPosition.y - addRectInfo.startPosition.y,
        ),
      };
      if (rects.length > 0) {
        const chkArr = rects
          .map((el) => checkOverlap(el, selectedRect))
          .filter((e) => e === true);
        if (chkArr.length > 0) {
          setAddRectInfo({
            addRectInfo: { ...addRectInfo, isSelecting: false },
          });
        } else {
          setAddRectInfo({
            addRectInfo: { ...addRectInfo, isSelecting: false },
          });
          setRects({ rects: [...rects, selectedRect] });
        }
      } else {
        setAddRectInfo({
          addRectInfo: { ...addRectInfo, isSelecting: false },
        });
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
    setRects({
      rects: clearRects,
    });
  };

  const selectionStyle = {
    left: Math.min(addRectInfo.startPosition.x, addRectInfo.endPosition.x),
    top: Math.min(addRectInfo.startPosition.y, addRectInfo.endPosition.y),
    width: Math.abs(addRectInfo.endPosition.x - addRectInfo.startPosition.x),
    height: Math.abs(addRectInfo.endPosition.y - addRectInfo.startPosition.y),
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
        >
          {addRectInfo.isSelecting && (
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

import { FC, useRef } from "react";
import PreviewImg from "./PreviewImg";
import { useStore } from "../hooks/store";

const ImgUpload: FC = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewer, setPreviewer] = useStore((store) => store.imgUrl);
  const [, setRects] = useStore((store) => store.rects);
  const onFileChange = () => {
    if (
      fileRef.current &&
      fileRef.current.files &&
      fileRef.current.files.length > 0
    ) {
      const file = fileRef.current.files[0];
      // 處理檔案上傳邏輯
      setPreviewer({ imgUrl: URL.createObjectURL(file) });
      console.log("files: ", file);
    }
  };
  const resetFile = () => {
    if (fileRef.current) {
      fileRef.current.value = "";
    }
    setPreviewer({ imgUrl: null });
    setRects({ rects: [] });
  };
  return (
    <div className="pt-14 mx-auto">
      {/* <h1>uploader</h1> */}
      <div id="uploader" className="flex justify-center">
        <label htmlFor="imgUpload">
          <input
            id="imgUpload"
            type="file"
            accept="image/*"
            hidden
            ref={fileRef}
            onChange={onFileChange}
          />
          {!previewer && (
            <div
              className="border-2 rounded-lg grid place-items-center text-center"
              style={{ minWidth: 355, minHeight: 156 }}
            >
              <p>click to upload your image</p>
            </div>
          )}
        </label>
      </div>
      {previewer && <PreviewImg imgUrl={previewer} />}
      <div id="controls" className="flex justify-center items-center">
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg my-2"
          onClick={resetFile}
        >
          reset
        </button>
      </div>
    </div>
  );
};

export default ImgUpload;

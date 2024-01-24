import { FC, useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import { useStore } from "../hooks/store";
import ImgUpload from "../components/ImgUpload";
import "react-image-crop/dist/ReactCrop.css";

const WithCorp: FC = () => {
  const [previewer] = useStore((store) => store.imgUrl);
  const [crop, setCrop] = useState<Crop>();
  return (
    <div className="pt-14 mx-auto">
      <ImgUpload />
      <div className="w-full flex justify-center">
        {previewer && (
          <div style={{ width: 355 }}>
            <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
              <img src={previewer} />
            </ReactCrop>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithCorp;

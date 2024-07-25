import { useState } from "react";
import { Selection } from "./features/image-area-selector/types";
import ImageUploader from "./features/image-area-selector/components/ImageUploader";
import ImagePreview from "./features/image-area-selector/components/ImagePreview";
import DataPreview from "./features/image-area-selector/components/DataPreview";
import { css } from "@emotion/css";

const appContainer = css`
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const imageContainer = css`
  position: relative;
  width: 433px;
  height: 792px;
  display: flex;
  justify-content: center;
  margin-right: 136px;
  background-color: #f4f9fa;
  color: white;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 86px 20px 0 20px;
  overflow: hidden;
  box-shadow: 0 3px 15px 5px rgba(0, 0, 0, 0.1);
  &:after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    content: "";
    display: block;
    width: 100%;
    height: 56px;
    background-color: #ebf0f3;
  }
  &:before {
    position: absolute;
    top: 16px;
    left: 20px;
    right: 0;
    content: "";
    display: block;
    width: 24px;
    height: 24px;
    border-radius: 24px;
    background-color: #d4dade;
    z-index: 1;
  }
`;

export const App = () => {
  const [image, setImage] = useState<string | null>(null);
  const [selections, setSelections] = useState<Array<Selection>>([]);

  return (
    <div className={appContainer}>
      <div className={imageContainer}>
        {!image && <ImageUploader onImageUpload={setImage} />}
        {image && (
          <ImagePreview
            image={image}
            selections={selections}
            onSelectionsChange={setSelections}
          />
        )}
      </div>
      <DataPreview selections={selections} />
    </div>
  );
};

export default App;

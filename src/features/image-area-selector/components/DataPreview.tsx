import { Selection } from "../types";
import { css } from "@emotion/css";

const dataPreviewContainer = css`
  width: 548px;
  height: 703px;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #2a3948;
  color: white;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 16px;
  > pre {
    width: 100%;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 7px;
    }
    &::-webkit-scrollbar-button {
      background: transparent;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-track-piece {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: slategrey;
      border: 1px solid slategrey;
    }
    &::-webkit-scrollbar-track {
      box-shadow: transparent;
    }
  }
`;

interface DataPreviewProps {
  selections: Selection[];
}

const DataPreview = ({ selections }: DataPreviewProps) => {
  const selectionsWithoutIndex = selections.map((selection) => {
    return {
      x: selection.x,
      y: selection.y,
      width: selection.width,
      height: selection.height,
    };
  });

  return (
    <div className={dataPreviewContainer}>
      {selections.length !== 0 && (
        <pre>{JSON.stringify(selectionsWithoutIndex, null, 2)}</pre>
      )}
    </div>
  );
};

export default DataPreview;

export interface Selection {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
}

export interface ImageData {
  src: string;
  selections: Selection[];
}

import { Selection } from "../types";

export function createSelection(
  startPos: { x: number; y: number },
  endPos: { x: number; y: number },
  index: number,
): Selection {
  return {
    x: Math.min(startPos.x, endPos.x),
    y: Math.min(startPos.y, endPos.y),
    width: Math.abs(startPos.x - endPos.x),
    height: Math.abs(startPos.y - endPos.y),
    index: index,
  };
}

export const isValidSelection = (
  selection: Selection,
  imageWidth: number,
  imageHeight: number,
  existingSelections: Selection[] = [],
): boolean => {
  // Check if selection is large enough
  if (selection.width < 10 || selection.height < 10) {
    return false;
  }

  // Check if selection is within image bounds
  if (
    selection.x < 0 ||
    selection.y < 0 ||
    selection.x + selection.width > imageWidth ||
    selection.y + selection.height > imageHeight
  ) {
    return false;
  }

  // Ensure existingSelections is an array
  const selectionsArray = Array.isArray(existingSelections)
    ? existingSelections
    : [];

  // Check if selection overlaps with existing selections
  for (const existing of selectionsArray) {
    if (
      !(
        selection.x + selection.width <= existing.x ||
        existing.x + existing.width <= selection.x ||
        selection.y + selection.height <= existing.y ||
        existing.y + existing.height <= selection.y
      )
    ) {
      return false;
    }
  }

  return true;
};

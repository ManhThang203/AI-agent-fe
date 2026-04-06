const MENU_WIDTH = 176
const MENU_EST_HEIGHT = 96

export function computeThreadMenuPosition(anchorRect) {
  const margin = 6
  let top = anchorRect.bottom + margin
  const spaceBelow = window.innerHeight - anchorRect.bottom - margin

  if (
    spaceBelow < MENU_EST_HEIGHT &&
    anchorRect.top > MENU_EST_HEIGHT + margin
  ) {
    top = anchorRect.top - MENU_EST_HEIGHT - margin
  }

  let left = anchorRect.right - MENU_WIDTH
  const maxLeft = window.innerWidth - MENU_WIDTH - 8

  if (left > maxLeft) left = maxLeft
  if (left < 8) left = 8

  return { top, left }
}

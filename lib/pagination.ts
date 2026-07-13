// Builds a compact list of page tokens for a pager, e.g. on page 1 of 85:
// [1, 2, 3, 4, 5, "…", 85]. Always keeps the first and last page visible, plus
// a small window around the current page, collapsing the rest into an ellipsis.
// Keeps the control short no matter how large the catalogue grows.

export type PageToken = number | "ellipsis";

export function paginationRange(
  current: number,
  total: number,
  siblings = 1,
): PageToken[] {
  // first + last + current + `siblings` on each side + two ellipsis slots.
  const maxSlots = siblings * 2 + 5;

  // Few enough pages to show them all — no ellipsis needed.
  if (total <= maxSlots) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, total);
  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < total - 1;
  const edgeCount = 3 + siblings * 2; // pages shown on the un-collapsed side

  // Near the start: 1 … edgeCount, ellipsis, last.
  if (!showLeftEllipsis && showRightEllipsis) {
    const head = Array.from({ length: edgeCount }, (_, i) => i + 1);
    return [...head, "ellipsis", total];
  }

  // Near the end: 1, ellipsis, (total-edgeCount+1) … total.
  if (showLeftEllipsis && !showRightEllipsis) {
    const tail = Array.from({ length: edgeCount }, (_, i) => total - edgeCount + 1 + i);
    return [1, "ellipsis", ...tail];
  }

  // In the middle: 1, ellipsis, current-siblings … current+siblings, ellipsis, last.
  const middle = Array.from({ length: right - left + 1 }, (_, i) => left + i);
  return [1, "ellipsis", ...middle, "ellipsis", total];
}

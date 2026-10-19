const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const smooth = (value) => {
  const progress = clamp(value, 0, 1);
  return progress * progress * (3 - 2 * progress);
};

export function getGalleryLayout(centers, viewportCenter) {
  const offsets = centers.map((center) => viewportCenter - center);
  const travel = offsets.length > 1 ? Math.max(0, offsets[0] - offsets.at(-1)) : 0;
  const lead = travel ? 72 : 0;
  const hold = travel ? 180 : 0;
  return { offsets, travel, lead, hold, distance: travel + lead + hold };
}

export function getGalleryX(layout, progress) {
  const first = layout.offsets[0] ?? 0;
  return first - clamp(progress * layout.distance - layout.lead, 0, layout.travel);
}

export function getProjectState(distance, width) {
  const focus = smooth(1 - Math.abs(distance) / (width + 80));
  return {
    scale: 0.86 + 0.24 * focus,
    y: -24 * focus,
    rotation: clamp(distance / width, -1, 1) * -4,
  };
}

export function getProjectScroll(layout, index) {
  if (!layout.travel || index < 0 || index >= layout.offsets.length) return 0;
  if (index === 0) return 0;
  const position = layout.lead + layout.offsets[0] - layout.offsets[index];
  return index === layout.offsets.length - 1 ? position + layout.hold / 2 : position;
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { getGalleryLayout, getGalleryX, getProjectState, getProjectScroll } from '../../src/animations/projectGalleryGeometry.js';

test('the first and last projects center completely as the track moves left', () => {
  const layout = getGalleryLayout([340, 1100, 1860], 720);
  assert.equal(getGalleryX(layout, 0), 380);
  assert.equal(getGalleryX(layout, 1), -1140);
  assert.ok(getGalleryX(layout, 0.6) < getGalleryX(layout, 0.3));
});

test('every project in a growing gallery has a centered scroll position', () => {
  const centers = [340, 1100, 1860, 2620, 3380];
  const layout = getGalleryLayout(centers, 720);
  for (const [index, center] of centers.entries()) {
    const progress = getProjectScroll(layout, index) / layout.distance;
    assert.equal(center + getGalleryX(layout, progress), 720);
  }
  const pair = getGalleryLayout(centers.slice(0, 2), 720);
  assert.ok(pair.distance > 0 && pair.distance < 1400);
});

test('scale and elevation depend smoothly on distance from the visible center', () => {
  const centered = getProjectState(0, 680);
  const near = getProjectState(160, 680);
  const far = getProjectState(900, 680);
  assert.equal(centered.scale, 1.1);
  assert.equal(centered.y, -24);
  assert.equal(far.scale, 0.86);
  assert.ok(centered.scale > near.scale && near.scale > far.scale);
  assert.ok(centered.y < near.y && near.y < far.y);
  assert.equal(near.scale, getProjectState(-160, 680).scale);
  assert.equal(near.rotation, -getProjectState(-160, 680).rotation);
  assert.ok(Math.abs(centered.scale - getProjectState(0.01, 680).scale) < 0.00001);
});

test('the last project stays centered before pinning ends', () => {
  const layout = getGalleryLayout([340, 1100], 720);
  assert.ok(layout.hold >= 150);
  assert.equal(getGalleryX(layout, (layout.distance - 140) / layout.distance), -380);
  assert.equal(getGalleryX(layout, 1), -380);
});

test('empty and single-project galleries have no scroll distance', () => {
  for (const centers of [[], [300]]) {
    const layout = getGalleryLayout(centers, 720);
    assert.equal(layout.distance, 0);
    assert.equal(getProjectScroll(layout, 0), 0);
    assert.ok(Number.isFinite(getGalleryX(layout, 0.5)));
  }
});

test('resizing and filtering rebuild the travel and clamp out-of-range progress', () => {
  const wide = getGalleryLayout([340, 1100, 1860], 720);
  const narrow = getGalleryLayout([280, 920], 512);
  assert.ok(wide.distance > narrow.distance);
  assert.equal(920 + getGalleryX(narrow, 1), 512);
  assert.equal(getGalleryX(narrow, 0), getGalleryX(narrow, -1));
  assert.equal(getGalleryX(narrow, 1), getGalleryX(narrow, 2));
  assert.equal(getProjectScroll(narrow, -1), 0);
  assert.equal(getProjectScroll(narrow, 2), 0);
});

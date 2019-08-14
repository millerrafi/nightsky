// https://observablehq.com/@mbostock/geojson-in-three-js
import wireframe from './wireframe.js';
import { PALETTE } from '../constants.js';
import * as THREE from 'three';

export default function makeHorison(radius) {
  const mesh = {
    type: 'MultiLineString',
    coordinates: [].concat(
      Array.from(range(-180, 180, 90), x =>
        x % 90 ? meridian(x, -60, 60) : meridian(x, 0, 90)
      ),
      Array.from(range(0, 90 + 1e-6, 90), y => parallel(y, -180, 180))
    )
  };

  return wireframe(
    mesh,
    radius,
    new THREE.LineBasicMaterial({
      color: PALETTE.HORIZON,
      opacity: 1,
      transparent: true
    })
  );
}

function meridian(x, y0, y1, dy = 2.5) {
  return Array.from(range(y0, y1 + 1e-6, dy), y => [x, y]);
}

function parallel(y, x0, x1, dx = 2.5) {
  return Array.from(range(x0, x1 + 1e-6, dx), x => [x, y]);
}

function* range(start, stop, step) {
  for (let i = 0, v = start; v < stop; v = start + ++i * step) {
    yield v;
  }
}

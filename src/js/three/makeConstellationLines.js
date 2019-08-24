import wireframe from '../d3/wireframe.js';
import { constellationLines } from '../d3/constellationLines.js';
import * as THREE from 'three';
import * as topojson from 'topojson-client';

export default function makeConstellationLines(radius) {
  return wireframe(
    topojson.mesh(constellationLines),
    radius,
    new THREE.LineBasicMaterial({
      color: 0x666666,
      opacity: 0.5,
      transparent: true,
      blending: THREE.additiveBlending
    })
  );
}

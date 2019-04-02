import wireframe from '../d3/wireframe.js';
import { constellationLines } from '../d3/constellationLines.js';

export default function makeConstellationLines(radius) {
  return wireframe(
    topojson.mesh(constellationLines),
    radius,
    new THREE.LineBasicMaterial({
      color: 0xaaaaaa,
      opacity: 0.5,
      transparent: true
    })
  );
}

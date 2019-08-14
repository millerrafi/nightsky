import * as THREE from 'three';

const DEG = Math.PI / 180;

export default function makeRing({
  distance,
  color,
  width = 0.5 * DEG,
  front = {},
  back = {}
}) {
  const obj = new THREE.Object3D();

  const frontMesh = new THREE.Mesh(
    new THREE.SphereGeometry(
      distance,
      128,
      2,
      0,
      Math.PI * 2,
      Math.PI / 2 - width / 2,
      width
    ),
    new THREE.MeshBasicMaterial({
      color,
      side: THREE.FrontSide,
      opacity: 0.5,
      transparent: true,
      ...front
    })
  );

  const backMesh = new THREE.Mesh(
    new THREE.SphereGeometry(
      distance,
      128,
      2,
      0,
      Math.PI * 2,
      Math.PI / 2 - width / 2,
      width
    ),
    new THREE.MeshBasicMaterial({
      color,
      side: THREE.BackSide,
      ...back
    })
  );

  obj.add(frontMesh);
  obj.add(backMesh);
  return obj;
}

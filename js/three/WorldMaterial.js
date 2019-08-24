import * as THREE from 'three';
import fs from 'fs';

export default function WorldMaterial(day, night, options = {}) {
  const invert = options.invert ? -1 : 1;

  var uniforms = {
    invert: { type: 'float', value: invert },
    sunDirection: { type: 'v3', value: new THREE.Vector3(0, 1, 0) },
    dayTexture: {
      type: 't',
      value: new THREE.TextureLoader().load(day)
    },
    nightTexture: {
      type: 't',
      value: new THREE.TextureLoader().load(night)
    },
    ...THREE.UniformsUtils.clone(THREE.UniformsLib['lights'])
  };

  uniforms.dayTexture.value.wrapS = THREE.Repeat;
  uniforms.dayTexture.value.wrapT = THREE.Repeat;
  uniforms.nightTexture.value.wrapS = THREE.Repeat;
  uniforms.nightTexture.value.wrapT = THREE.Repeat;

  const vertexShader = fs.readFileSync('./js/three/WorldMaterial.vert', 'utf8');
  const fragmentShader = fs.readFileSync(
    './js/three/WorldMaterial.frag',
    'utf8'
  );

  return new THREE.ShaderMaterial({
    uniforms,
    lights: true,
    vertexShader,
    fragmentShader
  });
}

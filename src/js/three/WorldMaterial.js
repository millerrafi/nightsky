import * as THREE from 'three';
import fs from 'fs';

export default function WorldMaterial(day, night, options = {}) {
  const invert = options.invert ? -1 : 1;
  const { nightFallback, dayFallback } = options;

  const nightFallbackTexture = new THREE.Texture(nightFallback);
  nightFallbackTexture.needsUpdate = true;

  const dayFallbackTexture = new THREE.Texture(dayFallback);
  dayFallbackTexture.needsUpdate = true;

  var uniforms = {
    invert: { type: 'float', value: invert },
    sunDirection: { type: 'v3', value: new THREE.Vector3(0, 1, 0) },
    dayTexture: {
      type: 't',
      value: dayFallbackTexture
    },
    nightTexture: {
      type: 't',
      value: nightFallbackTexture
    },
    ...THREE.UniformsUtils.clone(THREE.UniformsLib['lights'])
  };

  uniforms.dayTexture.value.wrapS = THREE.Repeat;
  uniforms.dayTexture.value.wrapT = THREE.Repeat;
  uniforms.nightTexture.value.wrapS = THREE.Repeat;
  uniforms.nightTexture.value.wrapT = THREE.Repeat;

  const vertexShader = fs.readFileSync('./src/js/three/WorldMaterial.vert', 'utf8');
  const fragmentShader = fs.readFileSync(
    './src/js/three/WorldMaterial.frag',
    'utf8'
  );

  const material = new THREE.ShaderMaterial({
    uniforms,
    lights: true,
    vertexShader,
    fragmentShader
  });

  const nightTextureValue = new THREE.TextureLoader().load(night, () => {
    material.uniforms.nightTexture.value = nightTextureValue;
  });

  const dayTextureValue = new THREE.TextureLoader().load(day, () => {
    material.uniforms.dayTexture.value = dayTextureValue;
  });

  return material;
}

import * as THREE from 'three';

export default function LambertTextureMaterial(day, night, options = {}) {
  const invert = options.invert ? -1 : 1;

  var uniforms = {
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

  uniforms.dayTexture.value.wrapS = uniforms.dayTexture.value.wrapT = uniforms.nightTexture.value.wrapS = uniforms.nightTexture.value.wrapT =
    THREE.Repeat;

  return new THREE.ShaderMaterial({
    uniforms,
    lights: true,
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPos;
        varying vec3 vNormal;

        void main() {
          vUv = uv;
          vPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
          // That's NOT exacly how you should transform your
          // normals but this will work fine, since my model
          // matrix is pretty basic
          vNormal = (modelViewMatrix * vec4(normal, 0.0)).xyz;
          gl_Position = projectionMatrix * vec4(vPos, 1.0);
        }
      `,
    fragmentShader: `    
        varying vec2 vUv;
        varying vec3 vPos;
        varying vec3 vNormal;
        
        uniform float lightIntensity;
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;


        #if NUM_DIR_LIGHTS > 0
          struct DirectionalLight {
            vec3 direction;
           };
           uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
        #endif

        void main(void) {
          vec3 lightDirection = ${invert}.0 * -directionalLights[0].direction;
          float mixAmount = clamp(dot(lightDirection, vNormal) * 7.0, 0.0, 1.0);
          vec3 dayColor = texture2D( dayTexture, vUv ).rgb;
          vec3 nightColor = texture2D( nightTexture, vUv ).rgb;
          vec3 color = mix( nightColor, dayColor, mixAmount );

          gl_FragColor = vec4( color, 1.0 );
        }
      `
  });
}

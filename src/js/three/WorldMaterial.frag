varying vec2 vUv;
varying vec3 vPos;
varying vec3 vNormal;

uniform float invert;
uniform sampler2D dayTexture;
uniform sampler2D nightTexture;


#if NUM_DIR_LIGHTS > 0
  struct DirectionalLight {
    vec3 direction;
    };
    uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
#endif

void main(void) {
  vec3 lightDirection = invert * -directionalLights[0].direction;
  float mixAmount = clamp(dot(lightDirection, vNormal) * 7.0, 0.0, 1.0);
  vec3 dayColor = texture2D( dayTexture, vUv ).rgb;
  vec3 nightColor = texture2D( nightTexture, vUv ).rgb;
  vec3 color = mix( nightColor, dayColor, mixAmount );

  gl_FragColor = vec4( color, 1.0 );
}
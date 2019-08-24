varying vec2 vUv;
varying vec3 vPos;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
  vNormal = (modelViewMatrix * vec4(normal, 0.0)).xyz;
  gl_Position = projectionMatrix * vec4(vPos, 1.0);
}
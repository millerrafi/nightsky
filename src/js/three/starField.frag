varying vec3 vColor;
varying float vAlpha;
varying float fDot;

void main() {
  gl_FragColor = vec4(vColor, 0.1 + 0.9 * vAlpha * - clamp(fDot, -1.0, 0.0));
}
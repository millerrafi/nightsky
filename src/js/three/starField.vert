attribute float alpha;
varying float vAlpha;
attribute float size;
varying float vSize;
attribute vec3 vertexnormal;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPos;
varying vec3 cameraVector;
varying vec3 vCameraPos;  
varying float fDot;

void main() {
  vColor = color;
  vAlpha = alpha;
  vSize = size;
  vNormal = vertexnormal;
  vCameraPos = cameraPosition;
  cameraVector = cameraPosition - vPos;
  vPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
  vNormal = normalize(modelViewMatrix * vec4(vertexnormal, 0.0)).xyz;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  fDot = dot(vNormal, vec3(0.0, 0.0, 1.0));
  gl_PointSize = vSize;
  
  if (fDot > 0.0)
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
  else
    gl_Position = projectionMatrix * mvPosition;
}
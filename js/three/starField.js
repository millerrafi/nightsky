import { stars } from '../astro/stars14.js';

const vertexShader = `
  attribute float alpha;
  varying float vAlpha;
  attribute float size;
  varying float vSize;
  attribute vec3 vertexnormal;
  varying vec3 vNormal;
  varying vec3 vColor;
  varying vec3 vPos;
  varying vec3 cameraVector;
  void main() {
    vColor = color;
    vAlpha = alpha;
    vSize = size;
    vNormal = vertexnormal;
    cameraVector = cameraPosition - vPos;
    vPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = vSize;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const getFragmentShader = ({ dot }) =>
  !dot
    ? `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        gl_FragColor = vec4( vColor, vAlpha );
      }
    `
    : `
      varying vec3 vColor;
      varying vec3 vPos;
      varying float vAlpha;
      varying vec3 vNormal;
      varying vec3 cameraVector;
      void main() {
        // vec3 vNormal2 = vec3(vNormal.x, vNormal.y, -1.0 * vNormal.z);
        float fDot = dot(normalize(cameraVector), vNormal);
        gl_FragColor = vec4( vColor, vAlpha * clamp(-fDot, 0.0, 1.0) );
      }
    `;

const clamp = (x, a, b) => Math.max(a, Math.min(x, b));

export default function makeStarField(radius, options = {}) {
  const minSize = options.minSize || 0.5;
  const scalePoint = options.scalePoint || (mag => 5 * Math.exp(-0.2 * mag));
  const fadePoint = options.scalePoint || (mag => Math.exp(-0.2 * (mag - 4)));
  const dot = options.dot || false;

  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      dot
    },
    vertexShader,
    fragmentShader: getFragmentShader({ dot }),
    blending: options.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    // depthTest: false,
    transparent: true,
    vertexColors: true
  });

  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const normals = [];
  const colors = [];
  const alphas = [];
  const sizes = [];

  for (let i = 0, len = stars.length; i < len; i++) {
    const [mag, bv, long, lat] = stars[i];

    const lambda = -(long * Math.PI) / 180;
    const phi = (lat * Math.PI) / 180;
    const cosPhi = Math.cos(phi);

    const x = radius * cosPhi * Math.cos(lambda);
    const z = radius * cosPhi * Math.sin(lambda);
    const y = radius * Math.sin(phi);

    const [r, g, b] = bv_to_rgb(bv);

    if (x > -radius * 1.1 && y > -radius * 1.1 && z > -radius * 1.1) {
      positions.push(x);
      positions.push(y);
      positions.push(z);

      const normal = new THREE.Vector3(x, y, z).normalize();

      normals.push(normal.x);
      normals.push(normal.y);
      normals.push(normal.z);

      colors.push(r);
      colors.push(g);
      colors.push(b);

      sizes.push(Math.max(scalePoint(mag), minSize));
      alphas.push(clamp(fadePoint(mag), 0, 1));
      // alphas.push((14 - mag) / 14);
    }
  }

  geometry.addAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );

  geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.addAttribute(
    'vertexnormal',
    new THREE.Float32BufferAttribute(normals, 3)
  );
  geometry.addAttribute('alpha', new THREE.Float32BufferAttribute(alphas, 1));
  geometry.addAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

  console.log(geometry);

  return new THREE.Points(geometry, shaderMaterial);
}

function bv_to_rgb(bv) {
  var t = 4600 * (1 / (0.92 * bv + 1.7) + 1 / (0.92 * bv + 0.62));

  // t to xyY
  var x,
    y = 0;

  if ((t >= 1667) & (t <= 4000)) {
    x =
      (-0.2661239 * Math.pow(10, 9)) / Math.pow(t, 3) +
      (-0.234358 * Math.pow(10, 6)) / Math.pow(t, 2) +
      (0.8776956 * Math.pow(10, 3)) / t +
      0.17991;
  } else if ((t > 4000) & (t <= 25000)) {
    x =
      (-3.0258469 * Math.pow(10, 9)) / Math.pow(t, 3) +
      (2.1070379 * Math.pow(10, 6)) / Math.pow(t, 2) +
      (0.2226347 * Math.pow(10, 3)) / t +
      0.24039;
  }

  if ((t >= 1667) & (t <= 2222)) {
    y =
      -1.1063814 * Math.pow(x, 3) -
      1.3481102 * Math.pow(x, 2) +
      2.18555832 * x -
      0.20219683;
  } else if ((t > 2222) & (t <= 4000)) {
    y =
      -0.9549476 * Math.pow(x, 3) -
      1.37418593 * Math.pow(x, 2) +
      2.09137015 * x -
      0.16748867;
  } else if ((t > 4000) & (t <= 25000)) {
    y =
      3.081758 * Math.pow(x, 3) -
      5.8733867 * Math.pow(x, 2) +
      3.75112997 * x -
      0.37001483;
  }

  // xyY to XYZ, Y = 1
  var Y = 1.0;
  var X = y == 0 ? 0 : (x * Y) / y;
  var Z = y == 0 ? 0 : ((1 - x - y) * Y) / y;

  //XYZ to rgb
  /*var r = 0.41847 * X - 0.15866 * Y - 0.082835 * Z
  var g = -0.091169 * X + 0.25243 * Y + 0.015708 * Z
  var b = 0.00092090 * X - 0.0025498 * Y + 0.17860 * Z*/

  //XYZ to rgb
  var r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z;
  var g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
  var b = 0.0557 * X - 0.204 * Y + 1.057 * Z;

  //linear RGB to sRGB
  var R = r <= 0.0031308 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - 0.055;
  var G = g <= 0.0031308 ? 12.92 * g : 1.055 * Math.pow(g, 1 / 2.4) - 0.055;
  var B = b <= 0.0031308 ? 12.92 * b : 1.055 * Math.pow(b, 1 / 2.4) - 0.055;

  return [R, G, B];
}

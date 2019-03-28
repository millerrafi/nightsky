import normalize from './normalize.js';
const degToRad = deg => (deg / 360) * 2 * Math.PI;

export function getSunLongitude(date) {
  // days since J2000
  const n = +date / 86400000 + 2440587.5 - 2451545;
  const L = normalize(degToRad(280.46) + degToRad(0.985674) * n, 2 * 3.14159);
  const g = normalize(degToRad(357.528) + degToRad(0.9856003) * n, 2 * 3.14159);

  return L + degToRad(1.915) * Math.sin(g) + degToRad(0.02) * Math.sin(2 * g);
}

export default getSunLongitude;

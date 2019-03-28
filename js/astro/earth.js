// https://en.wikipedia.org/wiki/Sidereal_time#Earth_Rotation_Angle
export function ERA(date) {
  const n = +date / 86400000 + 2440587.5 - 2451545;
  return 2 * Math.PI * (0.779057273264 + 1.0027378119113544 * n);
}

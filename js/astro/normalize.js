export default function normalize(v, scale = 1) {
  v = v / scale;
  v = v - Math.floor(v);

  if (v < 0) {
    v = v + 1;
  }

  return v * scale;
}

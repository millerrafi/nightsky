import fs from 'fs';
const starsCSV = fs.readFileSync('./src/js/astro/stars11.csv', 'utf8');

// parse simple CSV, slice(1) to remove header row
const stars = starsCSV
  .trim()
  .split('\n')
  .slice(1)
  .map(line => line.split(','));

export default stars;
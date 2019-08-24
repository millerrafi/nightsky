import VSOP87 from './astro/VSOP87.json';

const MOON_LONGITUDE_TABLE = `
  D  M M1  F    sum_l     sum_r
---------------------------------
  0  0  1  0  6288774 -20905355
  2  0 -1  0  1274027  -3699111
  2  0  0  0   658314  -2955968
  0  0  2  0   213618   -569925
  0  1  0  0  -185116     48888
  0  0  0  2  -114332     -3149
  2  0 -2  0    58793    246158
  2 -1 -1  0    57066   -152138
  2  0  1  0    53322   -170733
  2 -1  0  0    45758   -204586
  0  1 -1  0   -40923   -129620
  1  0  0  0   -34720    108743
  0  1  1  0   -30383    104755
  2  0  0 -2    15327     10321
  0  0  1  2   -12528         0
  0  0  1 -2    10980     79661
  4  0 -1  0    10675    -34782
  0  0  3  0    10034    -23210
  4  0 -2  0     8548    -21636
  2  1 -1  0    -7888     24208
  2  1  0  0    -6766     30824
  1  0 -1  0    -5163     -8379
  1  1  0  0     4987    -16675
  2 -1  1  0     4036    -12831
  2  0  2  0     3994    -10445
  4  0  0  0     3861    -11650
  2  0 -3  0     3665     14403
  0  1 -2  0    -2689     -7003
  2  0 -1  2    -2602         0
  2 -1 -2  0     2390     10056
  1  0  1  0    -2348      6322
  2 -2  0  0     2236     -9884
  0  2  0  0    -2069         0
  2 -2 -1  0     2048     -4950
  2  0  1 -2    -1773      4130
  2  0  0  2    -1595         0
  4 -1 -1  0     1215     -3958
  0  0  2  2    -1110         0
  3  0 -1  0     -892      3258
  2  1  1  0     -810      2616
  4 -1 -2  0      759     -1897
  0  2 -1  0     -713     -2117
  2  2 -1  0     -700      2354
  2  1 -2  0      691         0
  2 -1  0 -2      596         0
  4  0  1  0      549     -1423
  0  0  4  0      537     -1117
  4 -1  0  0      520     -1571
  1  0 -2  0     -487     -1739
  2  1  0 -2     -399         0
  0  0  2 -2     -381     -4421
  1  1  1  0      351         0
  3  0 -2  0     -340         0
  4  0 -3  0      330         0
  2 -1  2  0      327         0
  0  2  1  0     -323      1165
  1  1 -1  0      299         0
  2  0  3  0      294         0
  2  0 -1 -2        0      8752
`
  .trim()
  .split('\n')
  .slice(2)
  .map(r => r.trim().split(/\s+/));

const MOON_LATITUDE_TABLE = `
  D  M M1  F   sum_b
----------------------
  0  0  0  1 5128122
  0  0  1  1  280602
  0  0  1 -1  277693
  2  0  0 -1  173237
  2  0 -1  1   55413
  2  0 -1 -1   46271
  2  0  0  1   32573
  0  0  2  1   17198
  2  0  1 -1    9266
  0  0  2 -1    8822
  2 -1  0 -1    8216
  2  0 -2 -1    4324
  2  0  1  1    4200
  2  1  0 -1   -3359
  2 -1 -1  1    2463
  2 -1  0  1    2211
  2 -1 -1 -1    2065
  0  1 -1 -1   -1870
  4  0 -1 -1    1828
  0  1  0  1   -1794
  0  0  0  3   -1749
  0  1 -1  1   -1565
  1  0  0  1   -1491
  0  1  1  1   -1475
  0  1  1 -1   -1410
  0  1  0 -1   -1344
  1  0  0 -1   -1335
  0  0  3  1    1107
  4  0  0 -1    1021
  4  0 -1  1     833
  0  0  1 -3     777
  4  0 -2  1     671
  2  0  0 -3     607
  2  0  2 -1     596
  2 -1  1 -1     491
  2  0 -2  1    -451
  0  0  3 -1     439
  2  0  2  1     422
  2  0 -3 -1     421
  2  1 -1  1    -366
  2  1  0  1    -351
  4  0  0  1     331
  2 -1  1  1     315
  2 -2  0 -1     302
  0  0  1  3    -283
  2  1  1 -1    -229
  1  1  0 -1     223
  1  1  0  1     223
  0  1 -2 -1    -220
  2  1 -1 -1    -220
  1  0  1  1    -185
  2 -1 -2 -1     181
  0  1  2  1    -177
  4  0 -2 -1     176
  4 -1 -1 -1     166
  1  0  1 -1    -164
  4  0  1 -1     132
  1  0 -1 -1    -119
  4 -1  0 -1     115
  2 -2  0  1     107
  `
  .trim()
  .split('\n')
  .slice(2)
  .map(r => r.trim().split(/\s+/));

const reduceAngle = (deg, scale = 360) =>
  (deg = deg - scale * Math.floor(deg / scale));

const sin = deg => {
  // reduce angle
  deg = deg - 360 * Math.floor(deg / 360);

  return Math.sin((Math.PI / 180) * deg);
};

const cos = deg => {
  // reduce angle
  deg = deg - 360 * Math.floor(deg / 360);

  return Math.cos((Math.PI / 180) * deg);
};

const DEG = Math.PI / 180;

const defaultBodies = ['Sun', 'Earth', 'Moon', 'planets'];

/**
 * Returns an object of astronomical data for a given date. Angles are returned in degrees, distances in kilometers.
 * 
 * Algorithms are based on Jean Meeus, Astronomical Algorithms. 2nd ed., Willmann-Bell, 1998.
 * 
 * The target accuracy of all positions is 0.1° in the years 1900 to 2100. Calculations use the J2000.0 epoch and ignore small effects such as the precession and nutation of the ecliptic.
 * 
 * The positions of the planets use VSOP87, which has been truncated where convenient while staying within the target accuracy.

 *
 * @param {Date|number} date
 * @param {Object} options
 * @param {Array} options.bodies An array of bodies to be included in the result. Defaults to `['Sun', 'Earth', 'Moon']`.
 */
export const getPositions = (date, { bodies = defaultBodies } = {}) => {
  bodies = bodies.map(b => b.toLowerCase().trim());

  if (typeof date === 'undefined') {
    throw new Error('no date');
  }

  let i;

  const JD = +date / 86400000 + 2440587.5;
  const T = (JD - 2451545) / 36525;

  // eccentricity of Earth's orbit (25.4)
  const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;

  // Sun's mean longitude (25.2)
  const L0 = reduceAngle(280.46646 + T * 36000.76983 + T * T * 0.0003032);

  // Moon's mean longitude (47.1)
  const L1 = reduceAngle(
    218.3164477 +
      T * 481267.88123421 +
      T * T * -0.0015786 +
      (T * T * T) / 538841 +
      (T * T * T * T) / -65194000
  );

  // Moon's mean elongation (47.2)
  const D = reduceAngle(
    297.8501921 +
      T * 445267.1114034 +
      T * T * -0.0018819 +
      (T * T * T) / 545868 +
      (T * T * T * T) / -113065000
  );

  // Sun's mean anomaly (47.3)
  const M = reduceAngle(
    357.5291092 +
      T * 35999.0502909 +
      T * T * -0.0001536 +
      (T * T * T) / 24490000
  );

  // Moon's mean anomaly (47.4)
  const M1 = reduceAngle(
    134.9633964 +
      T * 477198.8675055 +
      T * T * 0.0087414 +
      (T * T * T) / 69699 +
      (T * T * T * T) / -14712000
  );

  // Moon's argument of latitude (47.5)
  const F = reduceAngle(
    93.272095 +
      T * 483202.0175233 +
      T * T * -0.0036539 +
      (T * T * T) / -3526000 +
      (T * T * T * T) / 863310000
  );

  let positions = { JD, T, L1, D, M, M1, F };

  if (bodies.includes('earth')) {
    positions.Earth = {
      rotationAngle:
        (2 * Math.PI * (0.779057273264 + 1.0027378119113544 * (JD - 2451545))) /
        DEG
    };
  }

  if (bodies.includes('sun')) {
    // Sun's equation of the center
    const C =
      (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(M) +
      (0.019993 - 0.000101 * T) * sin(2 * M) +
      0.000289 * sin(3 * M);

    const R = (1.000001018 * (1 - e * e)) / (1 + e * cos(M + C));

    positions.Sun = {
      longitude: L0 + C,
      anomaly: M + C,
      distance: R
    };
  }

  if (bodies.includes('moon')) {
    const A1 = reduceAngle(119.75 + 131.849 * T);
    const A2 = reduceAngle(53.09 + 479264.29 * T);
    const A3 = reduceAngle(313.45 + 481266.484 * T);

    let sum_l = 0;
    let sum_r = 0;
    let sum_b = 0;
    let sine;

    i = MOON_LONGITUDE_TABLE.length;

    while (i--) {
      sine = sin(
        MOON_LONGITUDE_TABLE[i][0] * D +
          MOON_LONGITUDE_TABLE[i][1] * M +
          MOON_LONGITUDE_TABLE[i][2] * M1 +
          MOON_LONGITUDE_TABLE[i][3] * F
      );

      sum_l += MOON_LONGITUDE_TABLE[i][4] * sine;
      sum_r += MOON_LONGITUDE_TABLE[i][5] * sine;
    }

    i = MOON_LATITUDE_TABLE.length;

    while (i--) {
      sum_b +=
        MOON_LATITUDE_TABLE[i][4] *
        sin(
          MOON_LATITUDE_TABLE[i][0] * D +
            MOON_LATITUDE_TABLE[i][1] * M +
            MOON_LATITUDE_TABLE[i][2] * M1 +
            MOON_LATITUDE_TABLE[i][3] * F
        );
    }

    sum_l += 3958 * sin(A1) + 1962 * sin(L1 - F) + 318 * sin(A2);

    sum_b +=
      -2335 * sin(L1) +
      382 * sin(A3) +
      175 * sin(A1 - F) +
      175 * sin(A1 + F) +
      127 * sin(L1 - M1) -
      115 * sin(L1 + M1);

    const lambda = L1 + sum_l / 1e6;
    const beta = sum_b / 1e6;
    const Delta = 385000.56 + sum_r / 1e3;
    const pi = Math.asin(6378.14 / Delta);

    positions.Moon = {
      longitude: lambda,
      latitude: beta,
      diameter: (pi * 180) / Math.PI,
      distance: Delta,
      sum_r
    };
  }

  if (bodies.includes('planets')) {
    Object.assign(positions, getPlanetPositions(date));
  }

  return positions;
};

function getPlanetPositions(date) {
  const JD = +date / 86400000 + 2440587.5;
  const tau = (JD - 2451545) / 365250;

  const tau_ = [
    1,
    tau,
    tau * tau,
    tau * tau * tau,
    tau * tau * tau * tau,
    tau * tau * tau * tau * tau
  ];

  const positions = {};

  const getHelio = planet => {
    const helio = { L: 0, B: 0, R: 0 };

    ['L', 'B', 'R'].forEach(LBR => {
      for (let i = 0; i <= 5; i++) {
        const table = VSOP87[planet][LBR + i];

        if (table) {
          let j = table.length;

          while (j--) {
            const [a, b, c] = table[j];
            helio[LBR] += a * Math.cos(b + c * tau) * tau_[i];
          }
        }
      }
    });

    return helio;
  };

  const { L: L_0, B: B_0, R: R_0 } = getHelio('Earth');

  ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'].forEach(planet => {
    // heliocentric ecliptic

    let { L, B, R } = getHelio(planet);

    // geocentric rectangular
    let x = R * Math.cos(B) * Math.cos(L) - R_0 * Math.cos(B_0) * Math.cos(L_0);
    let y = R * Math.cos(B) * Math.sin(L) - R_0 * Math.cos(B_0) * Math.sin(L_0);
    let z = R * Math.sin(B) - R_0 * Math.sin(B_0);

    // geocentric ecliptic
    let lambda = reduceAngle(Math.atan2(y, x) / DEG);
    let beta = Math.atan2(z, Math.sqrt(x * x + y * y)) / DEG;
    let delta = Math.sqrt(x * x + y * y + z * z);

    L = reduceAngle(L / DEG);
    B = B / DEG;

    positions[planet] = {
      L,
      B,
      R,
      x,
      y,
      z,
      lambda,
      beta,
      delta,
      longitude: lambda,
      latitude: beta,
      distance: delta
    };
  });

  return positions;
}

// getPositions({ date: new Date('1992/04/12Z00:00'), bodies: ['moon'] });

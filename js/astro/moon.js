import normalize from './normalize.js';

const periods = {
  synodic: {
    JD: 2451550.1,
    days: 29.530588853
  },
  tropical: {
    JD: 2451555.8,
    days: 27.321582241
  },
  anomalistic: {
    JD: 2451562.2,
    days: 27.55454988
  },
  draconic: {
    JD: 2451565.2,
    days: 27.212220817
  }
};

const degToRad = deg => (deg / 360) * 2 * Math.PI;

export const getMoonLongitude = date => getMoonData(date).longitude;

export default function getMoonData(date) {
  // Julian day from Unix timestamp
  const JD = +date / 86400000 + 2440587.5;

  // fractional period to radians
  const RAD = 2 * Math.PI;

  const getFraction = type =>
    normalize((JD - periods[type].JD) / periods[type].days);

  const getDays = type => getFraction(type) * periods[type].days;

  // fraction of month
  const synF = getFraction('synodic');
  const tropF = getFraction('tropical');
  const anomF = getFraction('anomalistic');
  const dracF = getFraction('draconic');

  // days into month
  const synD = getDays('synodic');
  const tropD = getDays('tropical');
  const anomD = getDays('anomalistic');
  const dracD = getDays('draconic');

  // ecliptic coords, radians
  const longitude =
    degToRad(360) * tropF +
    degToRad(6.3) * Math.sin(dracF * RAD) +
    degToRad(1.3) * Math.sin(2 * synF * RAD - dracF * RAD) +
    degToRad(0.7) * Math.sin(2 * synF * RAD);

  // ecliptic coords, radians
  const latitude = degToRad(5.1) * Math.sin(dracF * RAD);

  const distance =
    // earth radii
    (60.4 -
      3.3 * Math.cos(anomF * RAD) -
      0.6 * Math.cos(2 * synF * RAD - anomF * RAD) -
      0.5 * Math.cos(2 * synF * RAD)) *
    // kilometers
    6378;

  // const ascendingNode = dracF * RAD - tropF * RAD;

  return {
    synF,
    tropF,
    anomF,
    dracF,
    synD,
    tropD,
    anomD,
    dracD,
    longitude,
    latitude,
    distance
  };
}

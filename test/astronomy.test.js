import { getPositions } from '../src/js/astronomy.js';
import './toBeCyclicallyCloseTo.js';

/**
 * Astronomy data sources:
 * https://eclipse.gsfc.nasa.gov/LEcat5/LE2001-2100.html
 * https://eclipse.gsfc.nasa.gov/SEcat5/SE2001-2100.html
 */

describe('validation', () => {
  test('throws if there is no date', () => {
    expect(() => getPositions()).toThrow('no date');
  });
});

describe('Moon', () => {
  describe('at total lunar eclipse', () => {
    test.each`
      date            | time
      ${'2001-01-09'} | ${'20:21:40'}
      ${'2003-05-16'} | ${'03:41:13'}
      ${'2003-11-09'} | ${'01:19:38'}
      ${'2004-05-04'} | ${'20:31:17'}
      ${'2004-10-28'} | ${'03:05:11'}
      ${'2007-03-03'} | ${'23:21:59'}
      ${'2007-08-28'} | ${'10:38:27'}
      ${'2008-02-21'} | ${'03:27:09'}
      ${'2010-12-21'} | ${'08:18:04'}
      ${'2011-06-15'} | ${'20:13:43'}
      ${'2011-12-10'} | ${'14:32:56'}
      ${'2014-04-15'} | ${'07:46:48'}
      ${'2014-10-08'} | ${'10:55:44'}
      ${'2015-04-04'} | ${'12:01:30'}
      ${'2015-09-28'} | ${'02:48:17'}
      ${'2018-01-31'} | ${'13:31:00'}
      ${'2018-07-27'} | ${'20:22:54'}
      ${'2019-01-21'} | ${'05:13:27'}
      ${'2021-05-26'} | ${'11:19:53'}
      ${'2022-05-16'} | ${'04:12:42'}
    `('on $date', ({ date, time }) => {
      const { Sun, Moon } = getPositions(new Date(`${date}Z${time}`), {
        bodies: ['Sun', 'Moon']
      });

      expect(Moon.latitude).toBeCyclicallyCloseTo(0, { precision: 0 });
      expect(Moon.longitude).toBeCyclicallyCloseTo(Sun.longitude + 180, {
        precision: 1
      });
    });
  });

  describe('at total solar eclipse', () => {
    test.each`
      date            | time
      ${'2001-06-21'} | ${'12:04:46'}
      ${'2001-12-14'} | ${'20:53:01'}
      ${'2002-06-10'} | ${'23:45:22'}
      ${'2002-12-04'} | ${'07:32:16'}
      ${'2003-11-23'} | ${'22:50:22'}
      ${'2005-10-03'} | ${'10:32:47'}
      ${'2006-03-29'} | ${'10:12:23'}
      ${'2006-09-22'} | ${'11:41:16'}
      ${'2008-02-07'} | ${'03:56:10'}
      ${'2008-08-01'} | ${'10:22:12'}
      ${'2009-01-26'} | ${'07:59:45'}
      ${'2009-07-22'} | ${'02:36:25'}
      ${'2010-01-15'} | ${'07:07:39'}
      ${'2010-07-11'} | ${'19:34:38'}
      ${'2012-05-20'} | ${'23:53:54'}
      ${'2012-11-13'} | ${'22:12:55'}
      ${'2013-05-10'} | ${'00:26:20'}
      ${'2015-03-20'} | ${'09:46:47'}
      ${'2016-03-09'} | ${'01:58:19'}
      ${'2016-09-01'} | ${'09:08:02'}
      ${'2017-02-26'} | ${'14:54:33'}
      ${'2017-08-21'} | ${'18:26:40'}
      ${'2019-07-02'} | ${'19:24:07'}
      ${'2019-12-26'} | ${'05:18:53'}
      ${'2020-12-14'} | ${'16:14:39'}
      ${'2021-06-10'} | ${'10:43:07'}
      ${'2021-12-04'} | ${'07:34:38'}
      ${'2023-10-14'} | ${'18:00:41'}
    `('on $date', ({ date, time }) => {
      const d = new Date(`${date}Z${time}`);
      const { Sun, Moon } = getPositions(new Date(`${date}Z${time}`), {
        bodies: ['Sun', 'Moon']
      });
      expect(Moon.longitude).toBeCyclicallyCloseTo(Sun.longitude, {
        precision: 0
      });
    });
  });
});

describe('Sun longitude', () => {
  describe('is 0° at March equinox', () => {
    test.each`
      date            | time       | expected
      ${'2014-03-20'} | ${'16:57'} | ${0}
      ${'2015-03-20'} | ${'22:45'} | ${0}
      ${'2016-03-20'} | ${'04:30'} | ${0}
      ${'2017-03-20'} | ${'10:28'} | ${0}
      ${'2018-03-20'} | ${'16:15'} | ${0}
      ${'2019-03-20'} | ${'21:58'} | ${0}
      ${'2020-03-20'} | ${'03:50'} | ${0}
      ${'2021-03-20'} | ${'09:37'} | ${0}
      ${'2022-03-20'} | ${'15:33'} | ${0}
      ${'2023-03-20'} | ${'21:24'} | ${0}
      ${'2024-03-20'} | ${'03:07'} | ${0}
    `('on $date', ({ date, time, expected }) => {
      const { Sun } = getPositions(new Date(`${date}Z${time}`), {
        bodies: ['Sun']
      });

      expect(Sun.longitude).toBeCyclicallyCloseTo(expected, { precision: 1 });
    });
  });

  describe('is 180° at September equinox', () => {
    test.each`
      date            | time       | expected
      ${'2014-09-23'} | ${'02:29'} | ${180}
      ${'2015-09-23'} | ${'08:21'} | ${180}
      ${'2016-09-22'} | ${'14:21'} | ${180}
      ${'2017-09-22'} | ${'20:02'} | ${180}
      ${'2018-09-23'} | ${'01:54'} | ${180}
      ${'2019-09-23'} | ${'07:50'} | ${180}
      ${'2020-09-22'} | ${'13:31'} | ${180}
      ${'2021-09-22'} | ${'19:21'} | ${180}
      ${'2022-09-23'} | ${'01:04'} | ${180}
      ${'2023-09-23'} | ${'06:50'} | ${180}
      ${'2024-09-22'} | ${'12:44'} | ${180}
    `('on $date', ({ date, time, expected }) => {
      const { Sun } = getPositions(new Date(`${date}Z${time}`), {
        bodies: ['Sun']
      });

      expect(Sun.longitude).toBeCyclicallyCloseTo(expected, { precision: 1 });
    });
  });
});

const dms = (d, m, s) => {
  const sgn = d > 0 ? 1 : -1;
  return sgn * (Math.abs(d) + m / 60 + s / 3600);
};

/**
 * Testing output against JPL HORIZONS solar system ephemeris
 * https://ssd.jpl.nasa.gov/horizons.cgi
 */
describe('ephemeris', () => {
  const ephemeris = {};

  // intervals of 7012704 minutes from year 1900 to 2100
  const dates = [
    '1900-Jan-01 00:00:00 UTC',
    '1913-May-02 22:24:00 UTC',
    '1926-Sep-01 20:48:00 UTC',
    '1940-Jan-01 19:12:00 UTC',
    '1953-May-02 17:36:00 UTC',
    '1966-Sep-01 16:00:00 UTC',
    '1980-Jan-01 14:24:00 UTC',
    '1993-May-02 12:48:00 UTC',
    '2006-Sep-01 11:12:00 UTC',
    '2020-Jan-01 09:36:00 UTC',
    '2033-May-02 08:00:00 UTC',
    '2046-Sep-01 06:24:00 UTC',
    '2060-Jan-01 04:48:00 UTC',
    '2073-May-02 03:12:00 UTC',
    '2086-Sep-01 01:36:00 UTC',
    '2100-Jan-01 00:00:00 UTC'
  ];

  dates.forEach(d => {
    ephemeris[d] = getPositions(new Date(d), {
      bodies: ['sun', 'moon', 'planets']
    });
  });

  describe('Sun', () => {
    test.each`
      date             | time          | distance            | longitude      | latitude
      ${'1900-Jan-01'} | ${'00:00:00'} | ${0.98326627303495} | ${280.1532939} | ${0.0000648}
      ${'1913-May-02'} | ${'22:24:00'} | ${1.00832579305915} | ${41.8842}     | ${-0.0000311}
      ${'1926-Sep-01'} | ${'20:48:00'} | ${1.00895778599028} | ${158.636007}  | ${0.0000501}
      ${'1940-Jan-01'} | ${'19:12:00'} | ${0.98327233905463} | ${280.2342046} | ${-0.0000256}
      ${'1953-May-02'} | ${'17:36:00'} | ${1.00809269987461} | ${42.0017369}  | ${-0.0002196}
      ${'1966-Sep-01'} | ${'16:00:00'} | ${1.00902369741457} | ${158.759369}  | ${-0.0001337}
      ${'1980-Jan-01'} | ${'14:24:00'} | ${0.9832682639055}  | ${280.326318}  | ${-0.0001487}
      ${'1993-May-02'} | ${'12:48:00'} | ${1.00795833968374} | ${42.1244204}  | ${-0.0002827}
      ${'2006-Sep-01'} | ${'11:12:00'} | ${1.00919431973266} | ${158.8862863} | ${-0.0001722}
      ${'2020-Jan-01'} | ${'09:36:00'} | ${0.98328455419883} | ${280.4172697} | ${-0.0001235}
      ${'2033-May-02'} | ${'08:00:00'} | ${1.00784044401002} | ${42.2429086}  | ${-0.0001856}
      ${'2046-Sep-01'} | ${'06:24:00'} | ${1.00936809732102} | ${159.0112921} | ${-0.0000683}
      ${'2060-Jan-01'} | ${'04:48:00'} | ${0.98337354530849} | ${280.5062898} | ${0.000064}
      ${'2073-May-02'} | ${'03:12:00'} | ${1.00766712377058} | ${42.3477359}  | ${-0.0001179}
      ${'2086-Sep-01'} | ${'01:36:00'} | ${1.00944732907378} | ${159.1350113} | ${-0.0000173}
      ${'2100-Jan-01'} | ${'00:00:00'} | ${0.98335772103676} | ${280.6041944} | ${0.0000877}
    `('on $date', ({ date, time, distance, longitude, latitude }) => {
      const { Sun } = ephemeris[`${date} ${time} UTC`];

      expect(Sun.distance).toBeCloseTo(distance, 2);
      expect(Sun.latitude).toBeCloseTo(latitude, 2);
      expect(Sun.longitude).toBeCyclicallyCloseTo(longitude, {
        precision: 1
      });
    });
  });

  describe('Moon', () => {
    test.each`
      date             | time          | distance          | longitude      | latitude
      ${'1900-Jan-01'} | ${'00:00:00'} | ${3.6838482401e5} | ${272.4162611} | ${1.1082667}
      ${'1913-May-02'} | ${'22:24:00'} | ${4.0163011377e5} | ${2.876453}    | ${0.018535}
      ${'1926-Sep-01'} | ${'20:48:00'} | ${3.9737181065e5} | ${99.7565628}  | ${-0.4866945}
      ${'1940-Jan-01'} | ${'19:12:00'} | ${3.7090062838e5} | ${184.9721646} | ${-1.8350805}
      ${'1953-May-02'} | ${'17:36:00'} | ${3.8372541695e5} | ${264.3058904} | ${-3.410983}
      ${'1966-Sep-01'} | ${'16:00:00'} | ${4.0620853786e5} | ${356.8131468} | ${-3.9588653}
      ${'1980-Jan-01'} | ${'14:24:00'} | ${3.8708142124e5} | ${91.0446609}  | ${-4.4007743}
      ${'1993-May-02'} | ${'12:48:00'} | ${3.64202695e5}   | ${172.2996619} | ${-5.1302358}
      ${'2006-Sep-01'} | ${'11:12:00'} | ${3.8726569968e5} | ${254.9549104} | ${-5.1890306}
      ${'2020-Jan-01'} | ${'09:36:00'} | ${4.0433569506e5} | ${350.8966897} | ${-5.0425266}
      ${'2033-May-02'} | ${'08:00:00'} | ${3.771861921e5}  | ${85.1636009}  | ${-4.7292333}
      ${'2046-Sep-01'} | ${'06:24:00'} | ${3.5843531807e5} | ${166.080078}  | ${-3.4729078}
      ${'2060-Jan-01'} | ${'04:48:00'} | ${3.8839550224e5} | ${249.8026825} | ${-2.0524366}
      ${'2073-May-02'} | ${'03:12:00'} | ${4.04735674e5}   | ${346.2008908} | ${-1.6118616}
      ${'2086-Sep-01'} | ${'01:36:00'} | ${3.8053890382e5} | ${78.3383374}  | ${-0.8185887}
      ${'2100-Jan-01'} | ${'00:00:00'} | ${3.7167883787e5} | ${157.4116056} | ${1.0917482}
    `('on $date', ({ date, time, distance, longitude, latitude }) => {
      const { Moon } = ephemeris[`${date} ${time} UTC`];

      // expect(Moon.distance).toBeCloseTo(distance, 2);
      expect(Moon.latitude).toBeCloseTo(latitude, 2);
      expect(Moon.longitude).toBeCyclicallyCloseTo(longitude, {
        precision: 1
      });
    });
  });

  describe('Mercury', () => {
    test.each`
      date             | time          | distance            | longitude      | latitude
      ${'1900-Jan-01'} | ${'00:00:00'} | ${1.14206658525104} | ${258.9977023} | ${1.126422}
      ${'1913-May-02'} | ${'22:24:00'} | ${0.96504759997086} | ${16.2112742}  | ${-2.9368593}
      ${'1926-Sep-01'} | ${'20:48:00'} | ${1.11544379690677} | ${143.0323214} | ${1.067719}
      ${'1940-Jan-01'} | ${'19:12:00'} | ${1.28575565010714} | ${263.3264359} | ${0.168798}
      ${'1953-May-02'} | ${'17:36:00'} | ${1.11981523294206} | ${20.5627181}  | ${-2.5792962}
      ${'1966-Sep-01'} | ${'16:00:00'} | ${1.28668186181054} | ${150.4391596} | ${1.7098375}
      ${'1980-Jan-01'} | ${'14:24:00'} | ${1.38395633419724} | ${268.8735239} | ${-0.6443969}
      ${'1993-May-02'} | ${'12:48:00'} | ${1.24674729259589} | ${27.3944011}  | ${-1.8981755}
      ${'2006-Sep-01'} | ${'11:12:00'} | ${1.36805568493079} | ${159.1434057} | ${1.7160882}
      ${'2020-Jan-01'} | ${'09:36:00'} | ${1.43487248928803} | ${275.0136587} | ${-1.3074819}
      ${'2033-May-02'} | ${'08:00:00'} | ${1.3207020784412}  | ${36.1060453}  | ${-0.931484}
      ${'2046-Sep-01'} | ${'06:24:00'} | ${1.36914150187558} | ${167.4315753} | ${1.309559}
      ${'2060-Jan-01'} | ${'04:48:00'} | ${1.43674173516654} | ${281.4611928} | ${-1.8080312}
      ${'2073-May-02'} | ${'03:12:00'} | ${1.3101349647628}  | ${45.9413161}  | ${0.2460297}
      ${'2086-Sep-01'} | ${'01:36:00'} | ${1.31001848998458} | ${174.7175604} | ${0.6364187}
      ${'2100-Jan-01'} | ${'00:00:00'} | ${1.3861086260763}  | ${288.0057741} | ${-2.1126781}
    `('on $date', ({ date, time, distance, longitude, latitude }) => {
      const { Mercury } = ephemeris[`${date} ${time} UTC`];

      expect(Mercury.distance).toBeCloseTo(distance, 2);
      expect(Mercury.latitude).toBeCloseTo(latitude, 2);
      expect(Mercury.longitude).toBeCyclicallyCloseTo(longitude, {
        precision: 1
      });
    });
  });

  describe('Venus', () => {
    test.each`
      date             | time          | distance            | longitude      | latitude
      ${'1900-Jan-01'} | ${'00:00:00'} | ${1.46459631223921} | ${306.3743723} | ${-1.6830905}
      ${'1913-May-02'} | ${'22:24:00'} | ${0.29490693763216} | ${29.6295022}  | ${4.0521355}
      ${'1926-Sep-01'} | ${'20:48:00'} | ${1.56725436576005} | ${137.9139509} | ${0.8277803}
      ${'1940-Jan-01'} | ${'19:12:00'} | ${1.40684403271546} | ${309.2873501} | ${-1.7485987}
      ${'1953-May-02'} | ${'17:36:00'} | ${0.33715038708334} | ${15.0315334}  | ${2.7440755}
      ${'1966-Sep-01'} | ${'16:00:00'} | ${1.60965706591477} | ${140.9782005} | ${0.9579778}
      ${'1980-Jan-01'} | ${'14:24:00'} | ${1.34383272928032} | ${312.1370293} | ${-1.7998928}
      ${'1993-May-02'} | ${'12:48:00'} | ${0.40379221949629} | ${5.544804}    | ${1.5899103}
      ${'2006-Sep-01'} | ${'11:12:00'} | ${1.64589292264698} | ${144.0820776} | ${1.0714523}
      ${'2020-Jan-01'} | ${'09:36:00'} | ${1.27577366569926} | ${314.8997209} | ${-1.8356095}
      ${'2033-May-02'} | ${'08:00:00'} | ${0.48400390490945} | ${0.1270165}   | ${0.7224019}
      ${'2046-Sep-01'} | ${'06:24:00'} | ${1.67568529622158} | ${147.2090021} | ${1.1685484}
      ${'2060-Jan-01'} | ${'04:48:00'} | ${1.202963324407}   | ${317.5507846} | ${-1.8537857}
      ${'2073-May-02'} | ${'03:12:00'} | ${0.57111523457035} | ${357.3913156} | ${0.0914369}
      ${'2086-Sep-01'} | ${'01:36:00'} | ${1.69881969589304} | ${150.3534285} | ${1.2496656}
      ${'2100-Jan-01'} | ${'00:00:00'} | ${1.12574343950103} | ${320.070487}  | ${-1.8524066}
    `('on $date', ({ date, time, distance, longitude, latitude }) => {
      const { Venus } = ephemeris[`${date} ${time} UTC`];

      expect(Venus.distance).toBeCloseTo(distance, 2);
      expect(Venus.latitude).toBeCloseTo(latitude, 2);
      expect(Venus.longitude).toBeCyclicallyCloseTo(longitude, {
        precision: 1
      });
    });
  });
  describe('Mars', () => {
    test.each`
      date             | time          | distance            | longitude      | latitude
      ${'1900-Jan-01'} | ${'00:00:00'} | ${2.4009634436723}  | ${283.8676737} | ${-0.925402}
      ${'1913-May-02'} | ${'22:24:00'} | ${1.88079504057897} | ${356.0189833} | ${-1.3542327}
      ${'1926-Sep-01'} | ${'20:48:00'} | ${0.63659099149856} | ${44.4761061}  | ${-2.9087125}
      ${'1940-Jan-01'} | ${'19:12:00'} | ${1.28838745805481} | ${358.5058472} | ${-0.330051}
      ${'1953-May-02'} | ${'17:36:00'} | ${2.448157484123}   | ${61.0316651}  | ${0.4748185}
      ${'1966-Sep-01'} | ${'16:00:00'} | ${2.33257633574218} | ${124.4780099} | ${1.0338501}
      ${'1980-Jan-01'} | ${'14:24:00'} | ${0.96174663562083} | ${164.0731465} | ${3.1488995}
      ${'1993-May-02'} | ${'12:48:00'} | ${1.51149136884475} | ${122.1902229} | ${1.9244304}
      ${'2006-Sep-01'} | ${'11:12:00'} | ${2.58370372835777} | ${175.6817947} | ${0.8131638}
      ${'2020-Jan-01'} | ${'09:36:00'} | ${2.1815364007475}  | ${238.6535978} | ${0.3576159}
      ${'2033-May-02'} | ${'08:00:00'} | ${0.70580715989647} | ${279.0826638} | ${-1.0537636}
      ${'2046-Sep-01'} | ${'06:24:00'} | ${1.27227578562786} | ${236.213897}  | ${-1.5901809}
      ${'2060-Jan-01'} | ${'04:48:00'} | ${2.25741964188701} | ${301.863209}  | ${-1.1359631}
      ${'2073-May-02'} | ${'03:12:00'} | ${2.20382533646842} | ${15.0902138}  | ${-0.9473366}
      ${'2086-Sep-01'} | ${'01:36:00'} | ${1.17327482442322} | ${77.3452332}  | ${-0.6624585}
      ${'2100-Jan-01'} | ${'00:00:00'} | ${0.86996043623233} | ${29.5253581}  | ${0.9517638}
    `('on $date', ({ date, time, distance, longitude, latitude }) => {
      const { Mars } = ephemeris[`${date} ${time} UTC`];

      expect(Mars.distance).toBeCloseTo(distance, 2);
      expect(Mars.latitude).toBeCloseTo(latitude, 2);
      expect(Mars.longitude).toBeCyclicallyCloseTo(longitude, {
        precision: 1
      });
    });
  });

  describe('Jupiter', () => {
    test.each`
      date             | time          | distance            | longitude      | latitude
      ${'1900-Jan-01'} | ${'00:00:00'} | ${6.11306248853611} | ${241.1358805} | ${0.8142934}
      ${'1913-May-02'} | ${'22:24:00'} | ${4.72066294342996} | ${287.8264446} | ${0.0478569}
      ${'1926-Sep-01'} | ${'20:48:00'} | ${4.07017022787805} | ${320.0642665} | ${-1.1249188}
      ${'1940-Jan-01'} | ${'19:12:00'} | ${5.00695938225454} | ${1.2486201}   | ${-1.2916899}
      ${'1953-May-02'} | ${'17:36:00'} | ${5.98492909405706} | ${58.3959905}  | ${-0.6810722}
      ${'1966-Sep-01'} | ${'16:00:00'} | ${5.89911710904255} | ${115.5434919} | ${0.156814}
      ${'1980-Jan-01'} | ${'14:24:00'} | ${4.81772967176349} | ${160.187055}  | ${1.1304618}
      ${'1993-May-02'} | ${'12:48:00'} | ${4.60713702830442} | ${186.04474}   | ${1.5439591}
      ${'2006-Sep-01'} | ${'11:12:00'} | ${5.75212153564032} | ${223.4698932} | ${0.899878}
      ${'2020-Jan-01'} | ${'09:36:00'} | ${6.20835181449887} | ${276.7625031} | ${0.0879735}
      ${'2033-May-02'} | ${'08:00:00'} | ${5.31031776323167} | ${332.9106816} | ${-0.8168804}
      ${'2046-Sep-01'} | ${'06:24:00'} | ${4.12979450315247} | ${18.059854}   | ${-1.5615955}
      ${'2060-Jan-01'} | ${'04:48:00'} | ${4.31818298103393} | ${51.1559357}  | ${-0.9994908}
      ${'2073-May-02'} | ${'03:12:00'} | ${5.70708464308424} | ${97.2795951}  | ${0.1065981}
      ${'2086-Sep-01'} | ${'01:36:00'} | ${6.36984117484469} | ${151.2044188} | ${0.8187386}
      ${'2100-Jan-01'} | ${'00:00:00'} | ${5.54584271205965} | ${201.2063216} | ${1.2766078}
    `('on $date', ({ date, time, distance, longitude, latitude }) => {
      const { Jupiter } = ephemeris[`${date} ${time} UTC`];

      expect(Jupiter.distance).toBeCloseTo(distance, 2);
      expect(Jupiter.latitude).toBeCloseTo(latitude, 2);
      expect(Jupiter.longitude).toBeCyclicallyCloseTo(longitude, {
        precision: 1
      });
    });
  });

  describe('Saturn', () => {
    test.each`
      date             | time          | distance            | longitude      | latitude
      ${'1900-Jan-01'} | ${'00:00:00'} | ${11.024668445679}  | ${267.7167386} | ${1.0076898}
      ${'1913-May-02'} | ${'22:24:00'} | ${9.98174501298252} | ${64.1270376}  | ${-1.6374174}
      ${'1926-Sep-01'} | ${'20:48:00'} | ${10.2100788230521} | ${230.6458677} | ${2.0299599}
      ${'1940-Jan-01'} | ${'19:12:00'} | ${8.99429343935531} | ${24.4364239}  | ${-2.5477708}
      ${'1953-May-02'} | ${'17:36:00'} | ${8.75848859142563} | ${202.5875309} | ${2.7598859}
      ${'1966-Sep-01'} | ${'16:00:00'} | ${8.60864307005975} | ${357.6200021} | ${-2.4481293}
      ${'1980-Jan-01'} | ${'14:24:00'} | ${9.14390717091186} | ${176.9932087} | ${2.1639891}
      ${'1993-May-02'} | ${'12:48:00'} | ${10.0844943721103} | ${329.1260451} | ${-1.209975}
      ${'2006-Sep-01'} | ${'11:12:00'} | ${10.0879032007819} | ${138.0096174} | ${0.847637}
      ${'2020-Jan-01'} | ${'09:36:00'} | ${10.9976792388956} | ${291.441773}  | ${0.0513046}
      ${'2033-May-02'} | ${'08:00:00'} | ${9.61398137615415} | ${93.481751}   | ${-0.622599}
      ${'2046-Sep-01'} | ${'06:24:00'} | ${9.8533781007391}  | ${256.7107233} | ${1.3277498}
      ${'2060-Jan-01'} | ${'04:48:00'} | ${8.36408824517121} | ${57.1453104}  | ${-2.1521755}
      ${'2073-May-02'} | ${'03:12:00'} | ${8.92644509941701} | ${232.9333068} | ${2.4471389}
      ${'2086-Sep-01'} | ${'01:36:00'} | ${8.65196365446473} | ${29.815718}   | ${-2.6768936}
      ${'2100-Jan-01'} | ${'00:00:00'} | ${9.87400674920779} | ${205.6316638} | ${2.4222185}
    `('on $date', ({ date, time, distance, longitude, latitude }) => {
      const { Saturn } = ephemeris[`${date} ${time} UTC`];

      expect(Saturn.distance).toBeCloseTo(distance, 2);
      expect(Saturn.latitude).toBeCloseTo(latitude, 2);
      expect(Saturn.longitude).toBeCyclicallyCloseTo(longitude, {
        precision: 1
      });
    });
  });
});

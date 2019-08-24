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

describe('Venus', () => {
  test('1992-12-20T00:00:00Z', () => {
    const { Venus } = getPositions(new Date('1992-12-20T00:00:00Z'), {
      bodies: ['planets']
    });

    expect(Venus.distance).toBeCloseTo(0.910845, 2);
    expect(Venus.latitude).toBeCloseTo(dms(-2, 5, 4.33), 2);
    expect(Venus.longitude).toBeCyclicallyCloseTo(313.081, { precision: 2 });
  });

  test.each`
    date            | distance            | longitude      | latitude
    ${'1900-01-01'} | ${1.46459631223921} | ${306.3743723} | ${-1.6830905}
    ${'1905-02-01'} | ${0.80116626853116} | ${357.6172627} | ${0.1253329}
    ${'1910-03-01'} | ${0.31392162872596} | ${315.4616516} | ${7.7798292}
    ${'1915-04-01'} | ${1.07022637287776} | ${329.2542918} | ${-0.3631828}
    ${'1920-05-01'} | ${1.62583722724339} | ${23.2082247}  | ${-1.4764243}
    ${'1925-06-01'} | ${1.69544389875061} | ${80.072646}   | ${0.4546751}
    ${'1930-07-01'} | ${1.23828307451087} | ${133.9833421} | ${1.8161164}
    ${'1935-08-01'} | ${0.45651230553451} | ${167.8409195} | ${-2.5391784}
    ${'1940-09-01'} | ${0.67023207056095} | ${112.5993496} | ${-3.0544657}
    ${'1945-10-01'} | ${1.38774177135523} | ${157.6897924} | ${1.0761594}
    ${'1950-11-01'} | ${1.71068167104549} | ${214.7258967} | ${1.0315053}
    ${'1955-12-01'} | ${1.52436742696531} | ${271.0530664} | ${-1.1826359}
    ${'1961-01-01'} | ${0.89727407014099} | ${325.2838686} | ${-1.6551841}
    ${'1966-02-01'} | ${0.27496414523855} | ${302.5983345} | ${7.6031747}
    ${'1971-03-01'} | ${0.96735611285944} | ${296.4079476} | ${1.2740164}
    ${'1976-04-01'} | ${1.57418740849264} | ${350.9134316} | ${-1.4307036}
    ${'1981-05-01'} | ${1.71584991909222} | ${46.6667762}  | ${-0.5184973}
    ${'1986-06-01'} | ${1.32924308450642} | ${102.4787304} | ${1.7713537}
    ${'1991-07-01'} | ${0.56972400450634} | ${142.7728722} | ${0.8288527}
    ${'1996-08-01'} | ${0.55900328190241} | ${84.9787089}  | ${-4.4004692}
    ${'2001-09-01'} | ${1.31534532969924} | ${125.7481954} | ${-0.0145336}
    ${'2006-10-01'} | ${1.70243816503594} | ${180.7257919} | ${1.4300489}
    ${'2011-11-01'} | ${1.57414702126738} | ${238.2980045} | ${-0.2585922}
    ${'2016-12-01'} | ${0.99156758820337} | ${292.2744785} | ${-2.4173505}
    ${'2022-01-01'} | ${0.27375919195874} | ${293.2948045} | ${2.8845626}
    ${'2027-02-01'} | ${0.88684671256165} | ${267.0231105} | ${2.49664}
    ${'2032-03-01'} | ${1.51397045833319} | ${317.1447576} | ${-0.7363789}
    ${'2037-04-01'} | ${1.72131428193004} | ${14.2891078}  | ${-1.2262422}
    ${'2042-05-01'} | ${1.41330777518481} | ${69.5353129}  | ${0.9891773}
    ${'2047-06-01'} | ${0.68171974504226} | ${115.7820003} | ${2.7065099}
    ${'2052-07-01'} | ${0.44902476533797} | ${60.6080713}  | ${-3.9438517}
    ${'2057-08-01'} | ${1.22566422243376} | ${93.1278978}  | ${-1.2874797}
    ${'2062-09-01'} | ${1.68537284657195} | ${148.2295488} | ${1.1989589}
    ${'2067-10-01'} | ${1.6252074652493}  | ${204.4395486} | ${0.7485086}
    ${'2072-11-01'} | ${1.07927319667506} | ${260.2551857} | ${-2.0950826}
    ${'2077-12-01'} | ${0.32508698551349} | ${279.0485995} | ${-2.6818516}
    ${'2083-01-01'} | ${0.78423548005419} | ${234.5019712} | ${3.010715}
    ${'2088-02-01'} | ${1.45998884597604} | ${285.6514818} | ${0.2646921}
    ${'2093-03-01'} | ${1.71744433628526} | ${340.4105787} | ${-1.4238239}
    ${'2098-04-01'} | ${1.4771758432965}  | ${37.4705963}  | ${-0.0934341}
  `('on $date', ({ date, distance, longitude, latitude }) => {
    const { Venus } = getPositions(new Date(`${date}T00:00:00Z`), {
      bodies: ['planets']
    });

    expect(Venus.distance).toBeCloseTo(distance, 2);
    expect(Venus.latitude).toBeCloseTo(latitude, 2);
    expect(Venus.longitude).toBeCyclicallyCloseTo(longitude, { precision: 1 });
  });
});

// 235.8870413   1.6715996

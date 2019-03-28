import normalize from '../js/astro/normalize';

describe('normalize', () => {
  test.each`
    input      | scale        | output
    ${99.3}    | ${undefined} | ${0.3}
    ${-99.3}   | ${undefined} | ${0.7}
    ${5}       | ${undefined} | ${0}
    ${-5}      | ${undefined} | ${0}
    ${0}       | ${undefined} | ${0}
    ${370}     | ${360}       | ${10}
    ${-1080.5} | ${360}       | ${359.5}
  `('returns $output given ($input, $scale)', ({ input, scale, output }) => {
    expect(normalize(input, scale)).toBeCloseTo(output);
  });
});

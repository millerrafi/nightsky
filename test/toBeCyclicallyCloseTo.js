expect.extend({
  /**
   * Takes the same signature as `expect().toBeCloseTo()`, but considers 359.98 to be close to 0.02 because the values are cyclical.
   * 
   * Defaults to scale of 360 degrees, and precision of half a degree.
   *
   * @param {number} received
   * @param {number} expected
   * @param {Object} options
   * @param {number} options.precision
   * @param {number} options.scale
   */
  toBeCyclicallyCloseTo(received, expected, options) {
    const { scale = 360, precision = 5 } = options;
    const expectedDiff = 10 ** -precision / 2;
    const diff = Math.abs(reduceAngle(expected - received, scale));
    const diff2 = Math.abs(scale - reduceAngle(expected - received, scale));
    const pass = diff < expectedDiff || diff2 < expectedDiff;
    if (pass) {
      return {
        message: () =>
          `Expected: ${this.utils.printExpected(expected)}\n` +
          `Received: ${this.utils.printReceived(received)}\n` +
          `Expected precision:    ${this.utils.printReceived(precision)}\n` +
          `Expected difference: < ${this.utils.printReceived(expectedDiff)}\n` +
          `Received difference:   ${this.utils.printReceived(diff)}\n`,
        pass: true
      };
    } else {
      return {
        message: () =>
          `Expected: ${this.utils.printExpected(expected)}\n` +
          `Received: ${this.utils.printReceived(received)}\n` +
          `Expected precision:    ${this.utils.printReceived(precision)}\n` +
          `Expected difference: < ${this.utils.printReceived(expectedDiff)}\n` +
          `Received difference:   ${this.utils.printReceived(diff)}\n`,
        pass: false
      };
    }
  }
});

const reduceAngle = (deg, scale = 360) =>
  (deg = deg - scale * Math.floor(deg / scale));

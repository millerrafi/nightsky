expect.extend({
  /**
   * Takes the same signature as `expect().toBeCloseTo()`, but considers 0.998 to be close to 0.002 because the values are cyclical.
   *
   * @param {number} received
   * @param {number} expected
   * @param {number} precision
   */
  toBeCyclicallyCloseTo(received, expected, precision = 2) {
    const expectedDiff = 10 ** -precision / 2;
    const diff = Math.abs(expected - received);
    const diff2 = Math.abs(1 - expected - received);
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

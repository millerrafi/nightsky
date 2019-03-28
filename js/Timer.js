
/**
 * Creates a timer instance, which runs at a settable rate.
 *
 * ```js
 * const myTimer = new Timer(options)
 *
 * // start and stop
 * myTimer.start();
 * myTimer.stop();
 * myTimer.toggle();
 *
 * // access current value
 * myTimer.value
 *
 * // change the timer rate
 * myTimer.setRate(60)
 * ```
 *
 * @param options Options
 * @param options.startDate Start value
 * @param options.defaultRate Default rate
 * @param options.tweenDuration Durations of tweens when rate changes
 * @param options.tweenDuration.up Duration of tween to a faster rate, default 1000
 * @param options.tweenDuration.down Duration of tween to a slower rate, default 100
 */
export default function Timer(options = {}) {
  const _t = this;

  const startDate = options.startDate || Date.now();
  const defaultRate = options.defaultRate || 1;
  const maxRate = options.maxRate || 365 * 24 * 60 * 60 * 1000;
  const minRate = options.minRate || 0;
  const tweenDuration = options.tweenDuration || { up: 900, down: 300 };

  const getNow = window.performance
    ? () => performance.timing.navigationStart + performance.now()
    : Date.now();

  _t.running = false;
  _t.rateBeforeStop = defaultRate;

  _t.state = {
    // kinematics
    a0: 0,
    t0: getNow(),
    v0: defaultRate,
    x0: startDate,
    value: startDate,

    // latest tick
    t: getNow(),
    v: 0,
    x: startDate
  };

  _t.setValue = x => {
    if (typeof x === 'string') {
      x = +new Date(x);
    }

    const { v0 } = _t.state;

    _t.state = {
      // kinematics
      a0: 0,
      t0: getNow(),
      v0: v0,
      x0: x,
      value: x,

      // latest tick
      t: getNow(),
      v: v0,
      x: x
    };
  };

  _t.toggle = () => {
    if (_t.running) {
      _t.stop();
    } else {
      _t.start();
    }
  };

  _t.start = () => {
    _t.running = true;

    _t.setRate(_t.rateBeforeStop);

    if (options.onStart) {
      options.onStart(_t.state);
    }

    tick();
  };

  _t.stop = () => {
    _t.running = false;
    _t.rateBeforeStop = _t.state.v0;
    _t.setRate(0);

    if (options.onStop) {
      options.onStop(_t.state);
    }
  };

  _t.setRate = v0 => {
    v0 = Math.min(v0, maxRate);
    v0 = Math.max(v0, minRate);

    const { v = 0, x = startDate } = _t.state;
    const now = getNow();
    const Dt = tweenDuration[v <= v0 ? 'up' : 'down'];
    const a0 = (v0 - v) / Dt;
    const x0 = 0.5 * a0 * Dt * Dt + v * Dt + x;

    _t.state = {
      // kinematics during transition
      tween: {
        t0: now,
        expires: now + Dt,
        a0: a0,
        v0: v,
        x0: x
      },

      t0: now + Dt,
      a0: 0,
      v0: v0,
      x0: x0,
      x: x,
      value: x,
      until: null,
      next: null
    };
  };

  function tick() {
    const now = getNow();

    let state = _t.state;

    // console.log(state);

    if (_t.state.tween) {
      if (_t.state.tween.expires > now) {
        state = _t.state.tween;
      } else {
        delete _t.state.tween;
      }
    }

    const { a0, v0, x0, t0 } = state;
    const dt = now - t0;

    _t.state.v = a0 * dt + v0;
    _t.state.x = 0.5 * a0 * dt * dt + v0 * dt + x0;
    _t.state.value = _t.state.x;
    _t.state.t = now;

    if (options.onTick) {
      options.onTick(_t.state);
    }

    if (_t.running || (_t.state.tween && _t.state.tween.expires < now)) {
      window.requestAnimationFrame(tick);
    }
  }
}

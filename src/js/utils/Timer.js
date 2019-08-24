// import '../../vendor/TweenLite.min.js';
// import '../../vendor/TimelineLite.min.js';

// import { TweenLite, Linear } from '../../vendor/TweenLite.js';
// import { TimelineLite } from '../../vendor/TimelineLite.js';
import { TweenLite, Linear, TimelineLite } from 'gsap';

// const { TweenLite, Linear, TimelineLite } = window;

const defaultConfig = {
  min: +new Date('1950/01/01 00:00'),
  max: +new Date('2050/01/01 00:00'),
  rate: 1,
  date: 0,
  tweenDuration: {
    up: 1000,
    down: 100
  },
  onStart: () => {},
  onStarted: () => {},
  onStop: () => {},
  onStopped: () => {},
  onUpdate: () => {}
};

/**
 * Creates a timer instance, which runs at a settable rate. Smoothly animates changes to start, stop, value, and rate.
 *
 * ```js
 * const myTimer = new Timer(config)
 *
 * // start and stop
 * myTimer.start();
 * myTimer.stop();
 * myTimer.toggle();
 *
 * // get current value
 * myTimer.date
 *
 * // set current value
 * myTimer.setDate(+new Date('2000/01/01 00:00'))
 *
 * // change the timer rate
 * myTimer.setRate(60)
 * ```
 *
 *
 * @typedef {Object} TimerConfig
 * @property {number} min Min value, default 1950/01/01 00:00 as unix timestamp
 * @property {number} max Max value, default 2050/01/01 00:00 as unix timestamp
 * @property {number} rate Max value, default 2050/01/01 00:00 as unix timestamp
 * @property {object} tweenDuration Durations of tweens when rate changes
 * @property {number} tweenDuration.up Duration of tween to a faster rate, in ms, default 1000
 * @property {number} tweenDuration.down Duration of tween to a slower rate, in ms, default 100
 * @property {Function} onStart callback when timer begins starting
 * @property {Function} onStarted callback when timer completes starting
 * @property {Function} onStop callback when timer begins stopping
 * @property {Function} onStopped callback when timer completes stopping
 * @property {Function} onUpdate callback for every tick of the timer
 *
 * @param {TimerConfig} config
 *
 * @typedef {Object} TimerInstance
 * @property {boolean} running whether the timer is running
 * @property {number} date current date (unix timestamp)
 * @property {number} rate current rate (scalar)
 * @property {Function} setDate sets the date
 * @property {Function} setRate sets the rate
 *
 * @returns {TimerInstance}
 */
export default function Timer(config = {}) {
  const mergedConfig = { ...defaultConfig, ...config };

  const { onStart, onStarted, onStop, onStopped, onUpdate } = mergedConfig;

  Object.keys(mergedConfig).forEach(k => {
    this[k] = mergedConfig[k];
  });

  const duration = this.max - this.min;

  const tl = new TimelineLite({ paused: true });

  const initialProgress = (this.date - this.min) / duration;

  this.running = false;
  tl.timeScale(0);

  tl.fromTo(
    this,
    duration / 1000,
    { date: this.min },
    {
      date: this.max,
      ease: Linear.easeIn,
      onUpdate: () => {
        // console.log(new Date(this.date).toString(), tl.timeScale());
        this.onUpdate(this.date);
      },
      immediateRender: false
    }
  );

  tl.progress(initialProgress);

  this.start = () => {
    this.running = true;
    tl.resume();

    TweenLite.to(tl, this.tweenDuration.up / 1000, {
      timeScale: this.rate,
      onStart: onStart,
      onComplete: onStarted
    });
  };

  this.stop = () => {
    this.running = false;

    TweenLite.to(tl, this.tweenDuration.down / 1000, {
      timeScale: 0,
      onStart: onStop,
      onComplete: () => {
        tl.pause();
        onStopped();
      }
    });
  };

  this.toggle = () => {
    if (this.running) {
      this.stop();
    } else {
      this.start();
    }
  };

  this.setDate = (v, { dontAnimate } = {}) => {
    const progress = (+v - this.min) / duration;

    if (dontAnimate) {
      tl.progress(progress);
    } else {
      TweenLite.to(tl, this.tweenDuration.down / 1000, { progress });
    }
  };

  this.setRate = r => {
    this.rate = r;
    TweenLite.to(tl, this.tweenDuration.down / 1000, { timeScale: r });
  };

  return this;
}

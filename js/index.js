import Timer from './Timer.js';
import Viz1 from './three/Viz1.js';
import Viz2 from './three/Viz2.js';
import Viz3 from './three/Viz3.js';
import { DAYS } from './constants.js';
import { path } from './path.js';
import { getPositions } from './astronomy.js';
import Range from './utils/Range.js';

const speedDisplay = document.getElementById('speed-display');
const dateDisplay = document.getElementById('date-display');
const timeDisplay = document.getElementById('time-display');
const coordsMarker = document.getElementById('coords-marker');

const coordsInput = document.getElementById('coords-input');
coordsInput.style = `
  background: #333 url(${path}/img/earth-night.jpg);
  background-size: cover;
`;

const handleMouseOnCoordsInput = ({ clientX, clientY }) => {
  const { left, top, width, height } = coordsInput.getBoundingClientRect();
  const x = (clientX - left) / width;
  const y = (clientY - top) / height;

  const location = [90 - y * 180, x * 360 - 180];

  setLocation(location);
};

coordsInput.addEventListener('mousedown', e => {
  handleMouseOnCoordsInput(e);
  coordsInput.addEventListener('mousemove', handleMouseOnCoordsInput);
});

document.addEventListener('mouseup', e => {
  coordsInput.removeEventListener('mousemove', handleMouseOnCoordsInput);
});

let isShiftDown = false;

window.addEventListener('keydown', e => {
  if (e.key === 'Shift') {
    isShiftDown = true;
  }
});

window.addEventListener('keyup', e => {
  if (e.key === 'Shift') {
    isShiftDown = false;
  }
});

const viz1 = new Viz1('1');
const viz2 = new Viz2('2');
const viz3 = new Viz3('3');

const hide = {};

window.addEventListener('keydown', e => {
  let toHide = null;

  switch (e.key) {
    case 'g':
      toHide = 'grid';
      break;
    case 'c':
      toHide = 'constellations';
      break;
    case 'e':
      toHide = 'equator';
      break;
    case 'h':
      toHide = 'horizon';
      break;
    case 'o':
      toHide = 'orbits';
      break;
    case 's':
      toHide = 'stars';
      break;

    default:
  }

  if (toHide) {
    hide[toHide] = !hide[toHide];
  }
});

let sizes = localStorage.getItem('split-sizes');
// let sizes = null;

if (sizes) {
  sizes = JSON.parse(sizes);
} else {
  sizes = { 1: [70, 30], 2: [60, 40] };
}

Split(['.pane-1', '.pane-2'], {
  // sizes: [60, 40],
  sizes: sizes[1],
  minSize: [0, 0],
  onDrag: onResize,
  onDragEnd: onDragEnd(1)
});

Split(['.pane-2a', '.pane-2b'], {
  // sizes: [50, 50],
  sizes: sizes[2],
  minSize: [0, 0],
  direction: 'vertical',
  onDrag: onResize,
  onDragEnd: onDragEnd(2)
});

function onResize(id) {
  viz1.onResize();
  viz2.onResize();
  viz3.onResize();
}

function onDragEnd(id) {
  return function(newSizes) {
    sizes[id] = newSizes;

    console.log(sizes);

    localStorage.setItem('split-sizes', JSON.stringify(sizes));
  };
}

onResize();

window.addEventListener('resize', onResize);

const startStopButton = document.getElementById('start-stop');

const setTimerRate = () => {
  const rate = Math.min(getSpeed(), 1 * DAYS);
  timer.setRate(rate);
  updateSpeedDisplay();
};

const speedSlider = new Range(document.getElementById('speed-slider'), {
  onUpdate: setTimerRate,
  min: 0,
  max: 1,
  value: 0
});

const getSpeed = () => {
  const MIN = 1;
  const MAX = 60 * 60 * 24 * 7;

  // scale input value quadratically from MIN to MAX
  return Math.pow(+speedSlider.value, 2) * (MAX - MIN) + MIN;
};

const renderSpeed = str => {
  speedDisplay.textContent = str;
};

function updateSpeedDisplay() {
  const scale = +getSpeed();

  if (scale === 1) {
    renderSpeed('x1');
    return;
  }

  if (scale < 60) {
    renderSpeed('x' + scale.toFixed(1));
    return;
  }

  if (scale < 60 * 60) {
    renderSpeed((scale / 60).toFixed(1) + ' min/s');
    return;
  }

  if (scale < 60 * 60 * 24) {
    renderSpeed((scale / 60 / 60).toFixed(1) + ' hr/s');
    return;
  }

  renderSpeed((scale / 60 / 60 / 24).toFixed(1) + ' days/s');
}

updateSpeedDisplay();

const timer = new Timer({
  startDate: Date.now(),
  defaultRate: getSpeed(),
  onStart: () => {
    startStopButton.textContent = '❚❚';
  },
  onStop: () => {
    startStopButton.textContent = '▶';
  }
});

window.timer = timer;

startStopButton.onclick = () => timer.toggle();

setTimerRate();

function setIfNotFocused(el, val, process) {
  if (document.activeElement !== el) {
    el.value = process(val);
  }
}

dateDisplay.addEventListener('keyup', () => {
  const value = dateDisplay.value;

  if (/^\d\d\d\d\-\d\d\-\d\d$/.test(value.trim())) {
    const date = +new Date(value);

    if (date) {
      timer.setValue(date);
    }
  }
});

const dateSlider = new Range(document.getElementById('date-slider'), {
  onUpdate: v => {
    if (isShiftDown) {
      const time = getHHMMSS(+timeSlider.value, { inUTC: true });
      const date = getYYYYMMDD(+v);
      timer.setValue(+new Date(`${date}Z${time}`));
    } else {
      timer.setValue(+v);
    }
  }
});

const timeSlider = new Range(document.getElementById('time-slider'), {
  onUpdate: v => {
    timer.setValue(+timeSlider.value);
  }
});

function updateDateSlider(t) {
  if (!dateSlider.isSeeking) {
    const year = new Date(t).getFullYear();
    const min = +new Date(`${year}-01-01Z0:00:00`);
    const max = +new Date(`${year}-12-31Z23:59:59`);

    dateSlider.set({
      min,
      max,
      value: t
    });
  }
}

function updateTimeSlider(t) {
  if (!timeSlider.isSeeking) {
    const dateString = getYYYYMMDD(new Date(t).toString().slice(0, 16));
    const min = +new Date(`${dateString} 0:00:00`);
    const max = +new Date(`${dateString} 23:59:59`);
    timeSlider.set({
      min,
      max,
      value: t
    });
  }
}

const location = {};

function setLocation(arr) {
  if (arr.length !== 2) {
    return;
  }
  location.lat = +arr[0];
  location.long = +arr[1];
}

setLocation([31.7683, 35.2137]);

timer.start();
animate();

function formatDateDisplay(t) {
  return getYYYYMMDD(t);
}

function formatTimeDisplay(t) {
  const tzo = new Date(t).getTimezoneOffset();
  const timezoneString = `UTC${tzo >= 0 ? '-' : '+'}${Math.abs(tzo / 60)}`;

  return `${getHHMMSS(t)} (${timezoneString})`;
}

function updateCoordsMarker({ lat, long }) {
  const cmx = (long / 360 + 0.5) * 100;
  const cmy = ((90 - lat) / 180) * 100;
  coordsMarker.style.transform = `translate(${cmx}%, ${cmy}%)`;
}

function animate() {
  requestAnimationFrame(animate);
  const t = timer.state.value;

  setIfNotFocused(dateDisplay, t, formatDateDisplay);
  setIfNotFocused(timeDisplay, t, formatTimeDisplay);
  updateDateSlider(t);
  updateTimeSlider(t);
  updateCoordsMarker(location);

  const positions = getPositions(t);

  viz1.update({ positions, location, hide });
  viz2.update({ positions, location, hide });
  viz3.update({ positions, location, hide });
}

function getYYYYMMDD(date) {
  date = new Date(date);

  var mm = '' + (date.getMonth() + 1);
  var dd = '' + date.getDate();

  return (
    date.getFullYear() +
    '-' +
    (mm[1] ? mm : '0' + mm[0]) +
    '-' +
    (dd[1] ? dd : '0' + dd[0])
  );
}

function getHHMMSS(date, { inUTC: inUTC } = { inUTC: false }) {
  date = new Date(date);

  var hh = '' + (inUTC ? date.getUTCHours() : date.getHours());
  var mm = '' + date.getMinutes();
  var ss = '' + date.getSeconds();

  return (
    (hh[1] ? hh : `0${hh[0]}`) +
    ':' +
    (mm[1] ? mm : `0${mm[0]}`) +
    ':' +
    (ss[1] ? ss : `0${ss[0]}`)
  );
}

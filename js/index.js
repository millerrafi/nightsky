import Timer from './Timer.js';
import Viz1 from './three/Viz1.js';
import Viz2 from './three/Viz2.js';
import Viz3 from './three/Viz3.js';
import { DAYS } from './constants.js';

const speedSlider = document.getElementById('speed-slider');
const dateSlider = document.getElementById('date-slider');
const timeSlider = document.getElementById('time-slider');
const speedDisplay = document.getElementById('speed-display');
const dateDisplay = document.getElementById('date-display');
const timeDisplay = document.getElementById('time-display');
const locationInput = document.getElementById('location');

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

const getSpeed = () => {
  const speed = +speedSlider.value;
  return speed;
};

speedSlider.min = 1;
speedSlider.max = 2e6;
speedSlider.value = 1;

function updateSpeedDisplay() {
  speedDisplay.textContent =
    'x' + Math.round(+getSpeed().toPrecision(2)).toLocaleString();
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

const setTimerRate = () => {
  const rate = Math.min(getSpeed(), 1 * DAYS);
  timer.setRate(rate);
  updateSpeedDisplay();
};

speedSlider.oninput = setTimerRate;
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

let seekingDate = false;

dateSlider.onmousedown = e => {
  seekingDate = true;
  timer.stop();
};

dateSlider.oninput = e => {
  if (1) {
    const time = getHHMMSS(+timeSlider.value, { inUTC: true });
    const date = getYYYYMMDD(+dateSlider.value);
    timer.setValue(+new Date(`${date}Z${time}`));
  }
};

dateSlider.onmouseup = e => {
  seekingDate = false;
  timer.start();
};

let seekingTime = false;

timeSlider.onmousedown = e => {
  seekingTime = true;
  timer.setValue(+timeSlider.value);
  timer.stop();
};

timeSlider.oninput = e => {
  if (1) {
    timer.setValue(+timeSlider.value);
  }
};

timeSlider.onmouseup = e => {
  seekingTime = false;
  timer.start();
};

function updateDateSlider(t) {
  if (!seekingDate) {
    const year = new Date(t).getFullYear();
    const start = +new Date(`${year}-01-01Z0:00:00`);
    const end = +new Date(`${year}-12-31Z23:59:59`);
    dateSlider.min = start;
    dateSlider.max = end;
    dateSlider.value = t;
  }
}

function updateTimeSlider(t) {
  if (!seekingTime) {
    const dateString = getYYYYMMDD(new Date(t).toUTCString().slice(0, 16));
    const start = +new Date(`${dateString} 0:00:00`);
    const end = +new Date(`${dateString} 23:59:59`);
    timeSlider.min = start;
    timeSlider.max = end;
    timeSlider.value = t;
  }
}

const location = {};

function setLocation() {
  const arr = locationInput.value.split(',');
  if (arr.length !== 2) {
    return;
  }
  location.lat = arr[0].trim();
  location.long = arr[1].trim();
}

setLocation();
locationInput.oninput = setLocation;

timer.start();
animate();

function formatDateDisplay(t) {
  return getYYYYMMDD(t);
}

function formatTimeDisplay(t) {
  const tzo = new Date(t).getTimezoneOffset();
  const timezoneString = `UTC${tzo >= 0 ? '-' : '+'}${tzo / -60}`;

  return `${getHHMMSS(t)} (${timezoneString})`;
}

function animate() {
  requestAnimationFrame(animate);
  const t = timer.state.value;

  setIfNotFocused(dateDisplay, t, formatDateDisplay);
  setIfNotFocused(timeDisplay, t, formatTimeDisplay);
  updateDateSlider(t);
  updateTimeSlider(t);

  viz1.update({ t, location, hide });
  viz2.update({ t, location, hide });
  viz3.update({ t, location, hide });
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

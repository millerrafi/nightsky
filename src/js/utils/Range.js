const clamp = (num, min, max) => (num <= min ? min : num >= max ? max : num);

const defaultConfig = {
  min: 0,
  max: 100,
  transitionDuration: 250,
  onUpdate: () => {}
};

export default function Range(el, config = {}) {
  const mergedConfig = { ...defaultConfig, ...config };
  const { transitionDuration: trDur } = mergedConfig;

  const fillStyle = `
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: -100%;
    transform: translateX(0%);
    transition: transform 0ms;
  `;

  const fill = document.createElement('div');
  fill.setAttribute('data-range', true);
  fill.setAttribute('style', fillStyle);
  el.style.position = 'relative';
  el.style.overflow = 'hidden';
  el.appendChild(fill);

  this.isSeeking = false;

  this.update = (v, callback) => {
    // console.log(this);
    const pct = ((v - this.min) / (this.max - this.min)) * 100;
    this.value = v;
    fill.style.transform = `translateX(${pct}%)`;
    if (callback) callback(v);
  };

  this.set = obj => {
    Object.keys(obj).forEach(k => {
      this[k] = obj[k];
    });

    this.update(clamp(this.value, this.min, this.max));
  };

  this.set(mergedConfig);

  this.isSeeking = false;
  this.value = config.value || this.min;

  const getValue = e => {
    const { left, width } = el.getBoundingClientRect();
    let pct = ((e.clientX - left) / width) * 100;
    pct = clamp(pct, 0, 100);

    return (pct / 100) * (this.max - this.min) + this.min;
  };

  let disableTransition = false;

  const mouseMoveHandler = e => {
    this.update(getValue(e), this.onUpdate);

    if (!disableTransition) {
      fill.style.transition = 'transform 0ms';
      disableTransition = true;
    }
  };

  const mouseUpHandler = () => {
    disableTransition = false;
    fill.style.transition = 'transform 0ms';
    this.isSeeking = false;
    window.removeEventListener('mousemove', mouseMoveHandler);
  };

  el.onmousedown = e => {
    // left button only
    if (e.button !== 0) {
      return;
    }

    fill.style.transition = `transform ${trDur}ms`;
    this.isSeeking = true;
    this.update(getValue(e), this.onUpdate);
    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mouseup', mouseUpHandler);
  };

  return this;
}

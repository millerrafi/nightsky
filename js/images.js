import * as jpg from '../img/*.jpg';
import * as png from '../img/*.png';

const images = {};

const path = window.location.href.split('index.html')[0].split(/\/$/)[0];

Object.keys(jpg).forEach(k => {
  images[k + '.jpg'] = path + jpg[k];
});

Object.keys(png).forEach(k => {
  images[k + '.png'] = path + png[k];
});

export default images;

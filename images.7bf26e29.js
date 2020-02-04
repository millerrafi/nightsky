parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"uJCF":[function(require,module,exports) {
module.exports="/nightsky/earth-day.137d723f.jpg";
},{}],"NwoG":[function(require,module,exports) {
module.exports="/nightsky/earth-night.d071c417.jpg";
},{}],"ZvpX":[function(require,module,exports) {
module.exports="/nightsky/moon-day.a794d9c8.jpg";
},{}],"n7r6":[function(require,module,exports) {
module.exports="/nightsky/moon-night.7879ce35.jpg";
},{}],"zFiX":[function(require,module,exports) {
module.exports="/nightsky/moon.3e711068.jpg";
},{}],"m7Bz":[function(require,module,exports) {
module.exports={"earth-day":require("./earth-day.jpg"),"earth-night":require("./earth-night.jpg"),"moon-day":require("./moon-day.jpg"),"moon-night":require("./moon-night.jpg"),moon:require("./moon.jpg")};
},{"./earth-day.jpg":"uJCF","./earth-night.jpg":"NwoG","./moon-day.jpg":"ZvpX","./moon-night.jpg":"n7r6","./moon.jpg":"zFiX"}],"XP7X":[function(require,module,exports) {
module.exports="/nightsky/sun.34e83b2b.png";
},{}],"rzf8":[function(require,module,exports) {
module.exports={sun:require("./sun.png")};
},{"./sun.png":"XP7X"}],"Vn01":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=u(require("@babel/runtime-corejs2/core-js/object/keys")),r=o(require("../img/*.jpg")),t=o(require("../img/*.png"));function n(){if("function"!=typeof WeakMap)return null;var e=new WeakMap;return n=function(){return e},e}function o(e){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var r=n();if(r&&r.has(e))return r.get(e);var t={},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var u in e)if(Object.prototype.hasOwnProperty.call(e,u)){var f=o?Object.getOwnPropertyDescriptor(e,u):null;f&&(f.get||f.set)?Object.defineProperty(t,u,f):t[u]=e[u]}return t.default=e,r&&r.set(e,t),t}function u(e){return e&&e.__esModule?e:{default:e}}var f={};(0,e.default)(r).forEach(function(e){f[e+".jpg"]=r[e]}),(0,e.default)(t).forEach(function(e){f[e+".png"]=t[e]});var i=f;exports.default=i;
},{"@babel/runtime-corejs2/core-js/object/keys":"d81a","../img/*.jpg":"m7Bz","../img/*.png":"rzf8"}]},{},[], null)
//# sourceMappingURL=/nightsky/images.7bf26e29.js.map
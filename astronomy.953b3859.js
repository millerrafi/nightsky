// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/astronomy.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPositions = void 0;
var MOON_LONGITUDE_TABLE = "\n  D  M M1  F    sum_l     sum_r\n---------------------------------\n  0  0  1  0  6288774 -20905355\n  2  0 -1  0  1274027  -3699111\n  2  0  0  0   658314  -2955968\n  0  0  2  0   213618   -569925\n  0  1  0  0  -185116     48888\n  0  0  0  2  -114332     -3149\n  2  0 -2  0    58793    246158\n  2 -1 -1  0    57066   -152138\n  2  0  1  0    53322   -170733\n  2 -1  0  0    45758   -204586\n  0  1 -1  0   -40923   -129620\n  1  0  0  0   -34720    108743\n  0  1  1  0   -30383    104755\n  2  0  0 -2    15327     10321\n  0  0  1  2   -12528         0\n  0  0  1 -2    10980     79661\n  4  0 -1  0    10675    -34782\n  0  0  3  0    10034    -23210\n  4  0 -2  0     8548    -21636\n  2  1 -1  0    -7888     24208\n  2  1  0  0    -6766     30824\n  1  0 -1  0    -5163     -8379\n  1  1  0  0     4987    -16675\n  2 -1  1  0     4036    -12831\n  2  0  2  0     3994    -10445\n  4  0  0  0     3861    -11650\n  2  0 -3  0     3665     14403\n  0  1 -2  0    -2689     -7003\n  2  0 -1  2    -2602         0\n  2 -1 -2  0     2390     10056\n  1  0  1  0    -2348      6322\n  2 -2  0  0     2236     -9884\n  0  2  0  0    -2069         0\n  2 -2 -1  0     2048     -4950\n  2  0  1 -2    -1773      4130\n  2  0  0  2    -1595         0\n  4 -1 -1  0     1215     -3958\n  0  0  2  2    -1110         0\n  3  0 -1  0     -892      3258\n  2  1  1  0     -810      2616\n  4 -1 -2  0      759     -1897\n  0  2 -1  0     -713     -2117\n  2  2 -1  0     -700      2354\n  2  1 -2  0      691         0\n  2 -1  0 -2      596         0\n  4  0  1  0      549     -1423\n  0  0  4  0      537     -1117\n  4 -1  0  0      520     -1571\n  1  0 -2  0     -487     -1739\n  2  1  0 -2     -399         0\n  0  0  2 -2     -381     -4421\n  1  1  1  0      351         0\n  3  0 -2  0     -340         0\n  4  0 -3  0      330         0\n  2 -1  2  0      327         0\n  0  2  1  0     -323      1165\n  1  1 -1  0      299         0\n  2  0  3  0      294         0\n  2  0 -1 -2        0      8752\n".trim().split('\n').slice(2).map(function (r) {
  return r.trim().split(/\s+/);
});
var MOON_LATITUDE_TABLE = "\n  D  M M1  F   sum_b\n----------------------\n  0  0  0  1 5128122\n  0  0  1  1  280602\n  0  0  1 -1  277693\n  2  0  0 -1  173237\n  2  0 -1  1   55413\n  2  0 -1 -1   46271\n  2  0  0  1   32573\n  0  0  2  1   17198\n  2  0  1 -1    9266\n  0  0  2 -1    8822\n  2 -1  0 -1    8216\n  2  0 -2 -1    4324\n  2  0  1  1    4200\n  2  1  0 -1   -3359\n  2 -1 -1  1    2463\n  2 -1  0  1    2211\n  2 -1 -1 -1    2065\n  0  1 -1 -1   -1870\n  4  0 -1 -1    1828\n  0  1  0  1   -1794\n  0  0  0  3   -1749\n  0  1 -1  1   -1565\n  1  0  0  1   -1491\n  0  1  1  1   -1475\n  0  1  1 -1   -1410\n  0  1  0 -1   -1344\n  1  0  0 -1   -1335\n  0  0  3  1    1107\n  4  0  0 -1    1021\n  4  0 -1  1     833\n  0  0  1 -3     777\n  4  0 -2  1     671\n  2  0  0 -3     607\n  2  0  2 -1     596\n  2 -1  1 -1     491\n  2  0 -2  1    -451\n  0  0  3 -1     439\n  2  0  2  1     422\n  2  0 -3 -1     421\n  2  1 -1  1    -366\n  2  1  0  1    -351\n  4  0  0  1     331\n  2 -1  1  1     315\n  2 -2  0 -1     302\n  0  0  1  3    -283\n  2  1  1 -1    -229\n  1  1  0 -1     223\n  1  1  0  1     223\n  0  1 -2 -1    -220\n  2  1 -1 -1    -220\n  1  0  1  1    -185\n  2 -1 -2 -1     181\n  0  1  2  1    -177\n  4  0 -2 -1     176\n  4 -1 -1 -1     166\n  1  0  1 -1    -164\n  4  0  1 -1     132\n  1  0 -1 -1    -119\n  4 -1  0 -1     115\n  2 -2  0  1     107\n  ".trim().split('\n').slice(2).map(function (r) {
  return r.trim().split(/\s+/);
});

var reduceAngle = function reduceAngle(deg) {
  var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 360;
  return deg = deg - scale * Math.floor(deg / scale);
};

var sin = function sin(deg) {
  // reduce angle
  deg = deg - 360 * Math.floor(deg / 360);
  return Math.sin(Math.PI / 180 * deg);
};

var cos = function cos(deg) {
  // reduce angle
  deg = deg - 360 * Math.floor(deg / 360);
  return Math.cos(Math.PI / 180 * deg);
};

var DEG = Math.PI / 180;
var defaultBodies = ['Sun', 'Earth', 'Moon'];
/**
 * Returns an object of astronomical data for a given date. Angles are returned in degrees, distances in kilometers.
 * 
 * Algorithms are based on Jean Meeus, Astronomical Algorithms. 2nd ed., Willmann-Bell, 1998.
 * 
 * The target accuracy of all positions is 0.1° in the years 1900 to 2100. Calculations use the J2000.0 epoch and ignore small effects such as the precession and nutation of the ecliptic.

 *
 * @param {Date|number} date
 * @param {Object} options
 * @param {Array} options.bodies An array of bodies to be included in the result. Defaults to `['Sun', 'Earth', 'Moon']`.
 */

var getPositions = function getPositions(date) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$bodies = _ref.bodies,
      bodies = _ref$bodies === void 0 ? defaultBodies : _ref$bodies;

  bodies = bodies.map(function (b) {
    return b.toLowerCase().trim();
  });

  if (typeof date === 'undefined') {
    throw new Error('no date');
  }

  var i;
  var JD = +date / 86400000 + 2440587.5;
  var T = (JD - 2451545) / 36525; // eccentricity of Earth's orbit (25.4)

  var e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T; // Sun's mean longitude (25.2)

  var L0 = reduceAngle(280.46646 + T * 36000.76983 + T * T * 0.0003032); // Moon's mean longitude (47.1)

  var L1 = reduceAngle(218.3164477 + T * 481267.88123421 + T * T * -0.0015786 + T * T * T / 538841 + T * T * T * T / -65194000); // Moon's mean elongation (47.2)

  var D = reduceAngle(297.8501921 + T * 445267.1114034 + T * T * -0.0018819 + T * T * T / 545868 + T * T * T * T / -113065000); // Sun's mean anomaly (47.3)

  var M = reduceAngle(357.5291092 + T * 35999.0502909 + T * T * -0.0001536 + T * T * T / 24490000); // Moon's mean anomaly (47.4)

  var M1 = reduceAngle(134.9633964 + T * 477198.8675055 + T * T * 0.0087414 + T * T * T / 69699 + T * T * T * T / -14712000); // Moon's argument of latitude (47.5)

  var F = reduceAngle(93.272095 + T * 483202.0175233 + T * T * -0.0036539 + T * T * T / -3526000 + T * T * T * T / 863310000);
  var positions = {
    JD: JD,
    T: T,
    L1: L1,
    D: D,
    M: M,
    M1: M1,
    F: F
  };

  if (bodies.includes('earth')) {
    positions.Earth = {
      rotationAngle: 2 * Math.PI * (0.779057273264 + 1.0027378119113544 * (JD - 2451545)) / DEG
    };
  }

  if (bodies.includes('sun')) {
    // Sun's equation of the center
    var C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(M) + (0.019993 - 0.000101 * T) * sin(2 * M) + 0.000289 * sin(3 * M);
    var R = 1.000001018 * (1 - e * e) / (1 + e * cos(M + C));
    positions.Sun = {
      longitude: L0 + C,
      anomaly: M + C,
      distance: R
    };
  }

  if (bodies.includes('moon')) {
    var A1 = reduceAngle(119.75 + 131.849 * T);
    var A2 = reduceAngle(53.09 + 479264.29 * T);
    var A3 = reduceAngle(313.45 + 481266.484 * T);
    var sum_l = 0;
    var sum_r = 0;
    var sum_b = 0;
    var sine;
    i = MOON_LONGITUDE_TABLE.length;

    while (i--) {
      sine = sin(MOON_LONGITUDE_TABLE[i][0] * D + MOON_LONGITUDE_TABLE[i][1] * M + MOON_LONGITUDE_TABLE[i][2] * M1 + MOON_LONGITUDE_TABLE[i][3] * F);
      sum_l += MOON_LONGITUDE_TABLE[i][4] * sine;
      sum_r += MOON_LONGITUDE_TABLE[i][5] * sine;
    }

    i = MOON_LATITUDE_TABLE.length;

    while (i--) {
      sum_b += MOON_LATITUDE_TABLE[i][4] * sin(MOON_LATITUDE_TABLE[i][0] * D + MOON_LATITUDE_TABLE[i][1] * M + MOON_LATITUDE_TABLE[i][2] * M1 + MOON_LATITUDE_TABLE[i][3] * F);
    }

    sum_l += 3958 * sin(A1) + 1962 * sin(L1 - F) + 318 * sin(A2);
    sum_b += -2335 * sin(L1) + 382 * sin(A3) + 175 * sin(A1 - F) + 175 * sin(A1 + F) + 127 * sin(L1 - M1) - 115 * sin(L1 + M1);
    var lambda = L1 + sum_l / 1e6;
    var beta = sum_b / 1e6;
    var Delta = 385000.56 + sum_r / 1e3;
    var pi = Math.asin(6378.14 / Delta);
    positions.Moon = {
      longitude: lambda,
      latitude: beta,
      diameter: pi * 180 / Math.PI,
      distance: Delta,
      sum_r: sum_r
    };
  }

  return positions;
};

exports.getPositions = getPositions;
getPositions({
  date: new Date('1992/04/12Z00:00'),
  bodies: ['moon']
});
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62744" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/astronomy.js"], null)
//# sourceMappingURL=/astronomy.953b3859.js.map
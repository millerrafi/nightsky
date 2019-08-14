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
})({"js/d3/horizon.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeHorison;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/from"));

var _wireframe = _interopRequireDefault(require("./wireframe.js"));

var _constants = require("../constants.js");

var THREE = _interopRequireWildcard(require("three"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked =
/*#__PURE__*/
_regenerator.default.mark(range);

function makeHorison(radius) {
  var mesh = {
    type: 'MultiLineString',
    coordinates: [].concat((0, _from.default)(range(-180, 180, 90), function (x) {
      return x % 90 ? meridian(x, -60, 60) : meridian(x, 0, 90);
    }), (0, _from.default)(range(0, 90 + 1e-6, 90), function (y) {
      return parallel(y, -180, 180);
    }))
  };
  return (0, _wireframe.default)(mesh, radius, new THREE.LineBasicMaterial({
    color: _constants.PALETTE.HORIZON,
    opacity: 1,
    transparent: true
  }));
}

function meridian(x, y0, y1) {
  var dy = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2.5;
  return (0, _from.default)(range(y0, y1 + 1e-6, dy), function (y) {
    return [x, y];
  });
}

function parallel(y, x0, x1) {
  var dx = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2.5;
  return (0, _from.default)(range(x0, x1 + 1e-6, dx), function (x) {
    return [x, y];
  });
}

function range(start, stop, step) {
  var i, v;
  return _regenerator.default.wrap(function range$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          i = 0, v = start;

        case 1:
          if (!(v < stop)) {
            _context.next = 7;
            break;
          }

          _context.next = 4;
          return v;

        case 4:
          v = start + ++i * step;
          _context.next = 1;
          break;

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}
},{"@babel/runtime-corejs2/regenerator":"node_modules/@babel/runtime-corejs2/regenerator/index.js","@babel/runtime-corejs2/core-js/array/from":"node_modules/@babel/runtime-corejs2/core-js/array/from.js","./wireframe.js":"js/d3/wireframe.js","../constants.js":"js/constants.js","three":"node_modules/three/build/three.module.js"}],"js/three/Viz3.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Viz;

var _constants = require("../constants.js");

var THREE = _interopRequireWildcard(require("three"));

var _graticule = _interopRequireDefault(require("../d3/graticule.js"));

var _horizon = _interopRequireDefault(require("../d3/horizon.js"));

var _makeConstellationLines = _interopRequireDefault(require("./makeConstellationLines.js"));

var _LambertTextureMaterial = _interopRequireDefault(require("./LambertTextureMaterial.js"));

var _images = _interopRequireDefault(require("../images"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// import makeStarField from '/js/three/starField.js';
function Viz(index) {
  var canvas = document.getElementById("c".concat(index));
  var container = canvas.parentNode;
  var BCR = container.getBoundingClientRect(); // Set the scene size.

  var WIDTH = BCR.width;
  var HEIGHT = BCR.height; // coordsInput.
  // Set some camera attributes.

  var VIEW_ANGLE = 15;
  var ASPECT = WIDTH / HEIGHT;
  var NEAR = 0.1;
  var FAR = 10000;
  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas
  });
  var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  camera.position.set(200, 150, 200);
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);
  scene.add(camera);
  renderer.setSize(WIDTH, HEIGHT);
  var controls = new THREE.OrbitControls(camera, container);
  controls.enabled = false;
  canvas.addEventListener('mouseenter', function () {
    controls.enabled = true;
  });
  canvas.addEventListener('mouseleave', function () {
    controls.enabled = false;
  });
  var celestialSphere = new THREE.Object3D();
  var ground = new THREE.Mesh(new THREE.CircleGeometry(_constants.EARTH_DISTANCE, 64), new THREE.MeshBasicMaterial({
    color: 0xaa0000,
    // color: PALETTE.GROUND,
    transparent: true,
    opacity: 0.6
  }));
  scene.add(ground);
  ground.renderOrder = 1;
  ground.rotation.x = -Math.PI / 2;
  var underground = ground.clone();
  underground.material = new THREE.MeshBasicMaterial({
    color: 0xaa0000,
    // color: PALETTE.GROUND,
    blending: THREE.additiveBlending,
    transparent: true,
    opacity: 0.2
  });
  underground.rotation.x = Math.PI / 2;
  underground.renderOrder = 1;
  scene.add(underground);
  var sunMap = new THREE.TextureLoader().load(_images.default['sun.png']);
  var sunMaterial = new THREE.SpriteMaterial({
    map: sunMap,
    depthWrite: false
  });
  var sun = new THREE.Sprite(sunMaterial);
  sun.scale.set(_constants.SUN_RADIUS * 2, _constants.SUN_RADIUS * 2, 1);
  celestialSphere.add(sun);
  var eclipticPlane = new THREE.Mesh(new THREE.TorusGeometry(_constants.EARTH_DISTANCE, 0.1, 16, 100), new THREE.MeshBasicMaterial({
    color: _constants.PALETTE.ECLIPTIC,
    side: THREE.DoubleSide
  }));
  eclipticPlane.rotation.x = Math.PI / 2; // celestialSphere.add(mesh);

  var moon = new THREE.Mesh(new THREE.SphereGeometry(_constants.MOON_RADIUS * 2, 30, 30), (0, _LambertTextureMaterial.default)(_images.default['moon-day.jpg'], _images.default['moon-night.jpg']));
  var moonOrbit = new THREE.Mesh(new THREE.TorusGeometry(_constants.EARTH_DISTANCE, 0.1, 16, 100), new THREE.MeshBasicMaterial({
    color: _constants.PALETTE.MOON // side: THREE.DoubleSide

  }));
  moonOrbit.rotation.x = Math.PI / 2;
  var moonTilt = new THREE.Object3D();
  moonTilt.add(moon);
  moonTilt.add(moonOrbit);
  moonTilt.rotateOnWorldAxis(new THREE.Vector3(1, 0, 1).normalize(), 5.1 * _constants.DEG);
  eclipticPlane.rotation.x = Math.PI / 2;
  var ecliptic = new THREE.Object3D();
  ecliptic.add(sun);
  ecliptic.add(moonTilt);
  ecliptic.add(eclipticPlane);
  ecliptic.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), -_constants.EARTH_TILT * _constants.DEG);
  celestialSphere.add(ecliptic);
  var light = new THREE.DirectionalLight(0xffffff, 1);
  var targetObject = new THREE.Object3D();
  targetObject.position.set(0, 0, 0);
  celestialSphere.add(targetObject);
  light.target = sun;
  light.position.set(0, 0, 0);
  celestialSphere.add(light);
  var graticule = (0, _graticule.default)(_constants.EARTH_DISTANCE);
  celestialSphere.add(graticule);
  var constellations = (0, _makeConstellationLines.default)(_constants.EARTH_DISTANCE);
  celestialSphere.add(constellations);
  var equator = new THREE.Mesh(new THREE.TorusGeometry(_constants.EARTH_DISTANCE, 0.2, 16, 100), new THREE.MeshBasicMaterial({
    color: _constants.PALETTE.EQUATOR,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9
  }));
  equator.rotation.x = Math.PI / 2;
  celestialSphere.add(equator);
  scene.add(celestialSphere);
  var horizon = (0, _horizon.default)(_constants.EARTH_DISTANCE);
  scene.add(horizon);
  var northSouth = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, _constants.EARTH_DISTANCE * 2, 8), new THREE.MeshBasicMaterial({
    color: _constants.PALETTE.HORIZON
  }));
  northSouth.rotation.x = Math.PI / 2;
  scene.add(northSouth);
  var eastWest = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, _constants.EARTH_DISTANCE * 2, 8), new THREE.MeshBasicMaterial({
    color: _constants.PALETTE.HORIZON
  }));
  eastWest.rotation.z = Math.PI / 2;
  scene.add(eastWest);
  var height = 10;
  var observer = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, height, 8), new THREE.MeshBasicMaterial({
    color: _constants.PALETTE.HORIZON
  }));
  observer.position.set(0, height / 2, 0);
  scene.add(observer);

  require("_bundle_loader")(require.resolve('/js/three/starField.js')).then(function (_ref) {
    var makeStarField = _ref.makeStarField;
    var starField = makeStarField(_constants.EARTH_DISTANCE, {
      maxSize: 1,
      dot: true,
      additive: true,
      scalePoint: function scalePoint(mag) {
        return 3 * Math.exp(-0.2 * mag);
      }
    });
    celestialSphere.add(starField);
  }); // celestialSphere.add(makeStarField(EARTH_DISTANCE));


  return {
    update: function update(_ref2) {
      var positions = _ref2.positions,
          hide = _ref2.hide,
          location = _ref2.location;
      var sunLong = positions.Sun.longitude * _constants.DEG + Math.PI;
      var moonLong = positions.Moon.longitude * _constants.DEG + Math.PI;
      constellations.visible = !hide.constellations;
      moonOrbit.visible = !hide.orbits;
      eclipticPlane.visible = !hide.orbits;
      graticule.visible = !hide.equator;
      equator.visible = !hide.equator;
      horizon.visible = !hide.horizon;
      sun.position.x = _constants.EARTH_DISTANCE * Math.sin(sunLong);
      sun.position.z = _constants.EARTH_DISTANCE * Math.cos(sunLong);
      celestialSphere.rotation.x = (90 - location.lat) * _constants.DEG;
      celestialSphere.rotation.y = -location.long * _constants.DEG - positions.Earth.rotationAngle * _constants.DEG;
      moon.position.x = _constants.EARTH_DISTANCE * Math.sin(moonLong);
      moon.position.z = _constants.EARTH_DISTANCE * Math.cos(moonLong);
      moon.lookAt(ground.position);
      moon.rotateY(-Math.PI / 2);
      renderer.render(scene, camera);
      controls.update();
    },
    onResize: function onResize() {
      var BCR1 = container.getBoundingClientRect();
      var WIDTH = BCR1.width;
      var HEIGHT = BCR1.height;
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
      renderer.setSize(WIDTH, HEIGHT);
    }
  };
}
},{"../constants.js":"js/constants.js","three":"node_modules/three/build/three.module.js","../d3/graticule.js":"js/d3/graticule.js","../d3/horizon.js":"js/d3/horizon.js","./makeConstellationLines.js":"js/three/makeConstellationLines.js","./LambertTextureMaterial.js":"js/three/LambertTextureMaterial.js","../images":"js/images.js","_bundle_loader":"node_modules/parcel-bundler/src/builtins/bundle-loader.js","/js/three/starField.js":[["starField.1c349996.js","js/three/starField.js"],"starField.1c349996.js.map","js/three/starField.js"]}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
},{}],"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/bundle-loader.js":[function(require,module,exports) {
var getBundleURL = require('./bundle-url').getBundleURL;

function loadBundlesLazy(bundles) {
  if (!Array.isArray(bundles)) {
    bundles = [bundles];
  }

  var id = bundles[bundles.length - 1];

  try {
    return Promise.resolve(require(id));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return new LazyPromise(function (resolve, reject) {
        loadBundles(bundles.slice(0, -1)).then(function () {
          return require(id);
        }).then(resolve, reject);
      });
    }

    throw err;
  }
}

function loadBundles(bundles) {
  return Promise.all(bundles.map(loadBundle));
}

var bundleLoaders = {};

function registerBundleLoader(type, loader) {
  bundleLoaders[type] = loader;
}

module.exports = exports = loadBundlesLazy;
exports.load = loadBundles;
exports.register = registerBundleLoader;
var bundles = {};

function loadBundle(bundle) {
  var id;

  if (Array.isArray(bundle)) {
    id = bundle[1];
    bundle = bundle[0];
  }

  if (bundles[bundle]) {
    return bundles[bundle];
  }

  var type = (bundle.substring(bundle.lastIndexOf('.') + 1, bundle.length) || bundle).toLowerCase();
  var bundleLoader = bundleLoaders[type];

  if (bundleLoader) {
    return bundles[bundle] = bundleLoader(getBundleURL() + bundle).then(function (resolved) {
      if (resolved) {
        module.bundle.register(id, resolved);
      }

      return resolved;
    }).catch(function (e) {
      delete bundles[bundle];
      throw e;
    });
  }
}

function LazyPromise(executor) {
  this.executor = executor;
  this.promise = null;
}

LazyPromise.prototype.then = function (onSuccess, onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.then(onSuccess, onError);
};

LazyPromise.prototype.catch = function (onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.catch(onError);
};
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"node_modules/parcel-bundler/src/builtins/loaders/browser/js-loader.js":[function(require,module,exports) {
module.exports = function loadJSBundle(bundle) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.async = true;
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.src = bundle;

    script.onerror = function (e) {
      script.onerror = script.onload = null;
      reject(e);
    };

    script.onload = function () {
      script.onerror = script.onload = null;
      resolve();
    };

    document.getElementsByTagName('head')[0].appendChild(script);
  });
};
},{}],0:[function(require,module,exports) {
var b=require("node_modules/parcel-bundler/src/builtins/bundle-loader.js");b.register("js",require("node_modules/parcel-bundler/src/builtins/loaders/browser/js-loader.js"));b.load([]).then(function(){require("js/three/Viz3.js");});
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js",0], null)
//# sourceMappingURL=/Viz3.9e8c29a7.js.map
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
})({"node_modules/parcel-bundler/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"js/three/starField.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeStarField = exports.default = makeStarField;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/slicedToArray"));

var _fs = _interopRequireDefault(require("fs"));

var THREE = _interopRequireWildcard(require("three"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stars = starsCSV.trim().split('\n') // remove header
.slice(1).map(function (line) {
  return line.split(',');
});
var vertexShader = "\n  attribute float alpha;\n  varying float vAlpha;\n  attribute float size;\n  varying float vSize;\n  attribute vec3 vertexnormal;\n  varying vec3 vNormal;\n  varying vec3 vColor;\n  varying vec3 vPos;\n  varying vec3 cameraVector;\n  varying vec3 vCameraPos;  \n  varying float fDot;\n  // uniform vec3 Z = vec3( 0.0, 0.0, 1.0 );\n\n  void main() {\n    vColor = color;\n    vAlpha = alpha;\n    vSize = size;\n    vNormal = vertexnormal;\n    vCameraPos = cameraPosition;\n    cameraVector = cameraPosition - vPos;\n    vPos = (modelViewMatrix * vec4(position, 1.0)).xyz;\n    vNormal = normalize(modelViewMatrix * vec4(vertexnormal, 0.0)).xyz;\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    fDot = dot(vNormal, vec3( 0.0, 0.0, 1.0 ));\n    // gl_PointSize = 2.0;\n    gl_PointSize = vSize;\n    // gl_Position = projectionMatrix * mvPosition;\n\n    \n    if ( fDot > 0.0 )\n      gl_Position = vec4(2.0, 0.0, 0.0, 1.0);\n    else\n      gl_Position = projectionMatrix * mvPosition;\n  }\n";

var getFragmentShader = function getFragmentShader(_ref) {
  var dot = _ref.dot;
  return !dot ? "\n      varying vec3 vColor;\n      varying float vAlpha;\n      void main() {\n        gl_FragColor = vec4( vColor, vAlpha );\n      }\n    " : "\n      varying vec3 vColor;\n      // varying vec3 vPos;\n      varying float vAlpha;\n      // varying vec3 vNormal;\n      // varying vec3 cameraVector;\n      // varying vec3 vCameraPos;\n      varying float fDot;\n      \n      void main() {\n        gl_FragColor = vec4( vColor, 0.1 + 0.9 * vAlpha * - clamp(fDot, -1.0, 0.0) );\n      }\n    ";
};

var clamp = function clamp(x, a, b) {
  return Math.max(a, Math.min(x, b));
};

function makeStarField(radius) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var minSize = options.minSize || 0.5;

  var scalePoint = options.scalePoint || function (mag) {
    return 5 * Math.exp(-0.2 * mag);
  };

  var fadePoint = options.scalePoint || function (mag) {
    return Math.exp(-0.2 * (mag - 4));
  };

  var dot = options.dot || false;
  var shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      dot: dot
    },
    vertexShader: vertexShader,
    fragmentShader: getFragmentShader({
      dot: dot
    }),
    // blending: options.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    // depthTest: false,
    transparent: true,
    vertexColors: true
  });
  var geometry = new THREE.BufferGeometry();
  var positions = [];
  var normals = [];
  var colors = [];
  var alphas = [];
  var sizes = [];

  for (var i = 0, len = stars.length; i < len; i++) {
    var _stars$i = (0, _slicedToArray2.default)(stars[i], 4),
        mag = _stars$i[0],
        bv = _stars$i[1],
        long = _stars$i[2],
        lat = _stars$i[3];

    var lambda = -(long * Math.PI) / 180;
    var phi = lat * Math.PI / 180;
    var cosPhi = Math.cos(phi);
    var x = radius * cosPhi * Math.cos(lambda);
    var z = radius * cosPhi * Math.sin(lambda);
    var y = radius * Math.sin(phi);

    var _bv_to_rgb = bv_to_rgb(bv),
        _bv_to_rgb2 = (0, _slicedToArray2.default)(_bv_to_rgb, 3),
        r = _bv_to_rgb2[0],
        g = _bv_to_rgb2[1],
        b = _bv_to_rgb2[2];

    if (x > -radius * 1.1 && y > -radius * 1.1 && z > -radius * 1.1) {
      positions.push(x);
      positions.push(y);
      positions.push(z);
      var normal = new THREE.Vector3(x, y, z).normalize();
      normals.push(normal.x);
      normals.push(normal.y);
      normals.push(normal.z);
      colors.push(r);
      colors.push(g);
      colors.push(b);
      sizes.push(Math.max(scalePoint(mag), minSize));
      alphas.push(clamp(fadePoint(mag), 0, 1)); // alphas.push((14 - mag) / 14);
    }
  }

  geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.addAttribute('vertexnormal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.addAttribute('alpha', new THREE.Float32BufferAttribute(alphas, 1));
  geometry.addAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
  console.log(geometry);
  return new THREE.Points(geometry, shaderMaterial);
}

function bv_to_rgb(bv) {
  var t = 4600 * (1 / (0.92 * bv + 1.7) + 1 / (0.92 * bv + 0.62)); // t to xyY

  var x,
      y = 0;

  if (t >= 1667 & t <= 4000) {
    x = -0.2661239 * Math.pow(10, 9) / Math.pow(t, 3) + -0.234358 * Math.pow(10, 6) / Math.pow(t, 2) + 0.8776956 * Math.pow(10, 3) / t + 0.17991;
  } else if (t > 4000 & t <= 25000) {
    x = -3.0258469 * Math.pow(10, 9) / Math.pow(t, 3) + 2.1070379 * Math.pow(10, 6) / Math.pow(t, 2) + 0.2226347 * Math.pow(10, 3) / t + 0.24039;
  }

  if (t >= 1667 & t <= 2222) {
    y = -1.1063814 * Math.pow(x, 3) - 1.3481102 * Math.pow(x, 2) + 2.18555832 * x - 0.20219683;
  } else if (t > 2222 & t <= 4000) {
    y = -0.9549476 * Math.pow(x, 3) - 1.37418593 * Math.pow(x, 2) + 2.09137015 * x - 0.16748867;
  } else if (t > 4000 & t <= 25000) {
    y = 3.081758 * Math.pow(x, 3) - 5.8733867 * Math.pow(x, 2) + 3.75112997 * x - 0.37001483;
  } // xyY to XYZ, Y = 1


  var Y = 1.0;
  var X = y == 0 ? 0 : x * Y / y;
  var Z = y == 0 ? 0 : (1 - x - y) * Y / y; //XYZ to rgb

  /*var r = 0.41847 * X - 0.15866 * Y - 0.082835 * Z
  var g = -0.091169 * X + 0.25243 * Y + 0.015708 * Z
  var b = 0.00092090 * X - 0.0025498 * Y + 0.17860 * Z*/
  //XYZ to rgb

  var r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z;
  var g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
  var b = 0.0557 * X - 0.204 * Y + 1.057 * Z; //linear RGB to sRGB

  var R = r <= 0.0031308 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - 0.055;
  var G = g <= 0.0031308 ? 12.92 * g : 1.055 * Math.pow(g, 1 / 2.4) - 0.055;
  var B = b <= 0.0031308 ? 12.92 * b : 1.055 * Math.pow(b, 1 / 2.4) - 0.055;
  return [R, G, B];
}
},{"@babel/runtime-corejs2/helpers/slicedToArray":"node_modules/@babel/runtime-corejs2/helpers/slicedToArray.js","fs":"node_modules/parcel-bundler/src/builtins/_empty.js","three":"node_modules/three/build/three.module.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js"], null)
//# sourceMappingURL=/starField.1c349996.js.map
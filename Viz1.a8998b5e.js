parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"UskU":[function(require,module,exports) {
var e=require("three");e.OrbitControls=function(t,n){var o,a,i,r,s;this.object=t,this.domElement=void 0!==n?n:document,this.enabled=!0,this.target=new e.Vector3,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.25,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!1,this.keyPanSpeed=7,this.autoRotate=!1,this.autoRotateSpeed=2,this.enableKeys=!0,this.keys={LEFT:37,UP:38,RIGHT:39,BOTTOM:40},this.mouseButtons={LEFT:e.MOUSE.LEFT,MIDDLE:e.MOUSE.MIDDLE,RIGHT:e.MOUSE.RIGHT},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=function(){return b.phi},this.getAzimuthalAngle=function(){return b.theta},this.saveState=function(){c.target0.copy(c.target),c.position0.copy(c.object.position),c.zoom0=c.object.zoom},this.reset=function(){c.target.copy(c.target0),c.object.position.copy(c.position0),c.object.zoom=c.zoom0,c.object.updateProjectionMatrix(),c.dispatchEvent(l),c.update(),p=d.NONE},this.update=(o=new e.Vector3,a=(new e.Quaternion).setFromUnitVectors(t.up,new e.Vector3(0,1,0)),i=a.clone().inverse(),r=new e.Vector3,s=new e.Quaternion,function(){var e=c.object.position;return o.copy(e).sub(c.target),o.applyQuaternion(a),b.setFromVector3(o),c.autoRotate&&p===d.NONE&&N(2*Math.PI/60/60*c.autoRotateSpeed),b.theta+=E.theta,b.phi+=E.phi,b.theta=Math.max(c.minAzimuthAngle,Math.min(c.maxAzimuthAngle,b.theta)),b.phi=Math.max(c.minPolarAngle,Math.min(c.maxPolarAngle,b.phi)),b.makeSafe(),b.radius*=f,b.radius=Math.max(c.minDistance,Math.min(c.maxDistance,b.radius)),c.target.add(g),o.setFromSpherical(b),o.applyQuaternion(i),e.copy(c.target).add(o),c.object.lookAt(c.target),!0===c.enableDamping?(E.theta*=1-c.dampingFactor,E.phi*=1-c.dampingFactor,g.multiplyScalar(1-c.dampingFactor)):(E.set(0,0,0),g.set(0,0,0)),f=1,!!(v||r.distanceToSquared(c.object.position)>h||8*(1-s.dot(c.object.quaternion))>h)&&(c.dispatchEvent(l),r.copy(c.object.position),s.copy(c.object.quaternion),v=!1,!0)}),this.dispose=function(){c.domElement.removeEventListener("contextmenu",G,!1),c.domElement.removeEventListener("mousedown",Y,!1),c.domElement.removeEventListener("wheel",F,!1),c.domElement.removeEventListener("touchstart",X,!1),c.domElement.removeEventListener("touchend",_,!1),c.domElement.removeEventListener("touchmove",K,!1),document.removeEventListener("mousemove",Z,!1),document.removeEventListener("mouseup",z,!1),window.removeEventListener("keydown",I,!1)};var c=this,l={type:"change"},m={type:"start"},u={type:"end"},d={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_DOLLY_PAN:4},p=d.NONE,h=1e-6,b=new e.Spherical,E=new e.Spherical,f=1,g=new e.Vector3,v=!1,y=new e.Vector2,O=new e.Vector2,w=new e.Vector2,P=new e.Vector2,T=new e.Vector2,j=new e.Vector2,R=new e.Vector2,L=new e.Vector2,M=new e.Vector2;function C(){return Math.pow(.95,c.zoomSpeed)}function N(e){E.theta-=e}function S(e){E.phi-=e}var A,D=(A=new e.Vector3,function(e,t){A.setFromMatrixColumn(t,0),A.multiplyScalar(-e),g.add(A)}),x=function(){var t=new e.Vector3;return function(e,n){!0===c.screenSpacePanning?t.setFromMatrixColumn(n,1):(t.setFromMatrixColumn(n,0),t.crossVectors(c.object.up,t)),t.multiplyScalar(e),g.add(t)}}(),H=function(){var t=new e.Vector3;return function(e,n){var o=c.domElement===document?c.domElement.body:c.domElement;if(c.object.isPerspectiveCamera){var a=c.object.position;t.copy(a).sub(c.target);var i=t.length();i*=Math.tan(c.object.fov/2*Math.PI/180),D(2*e*i/o.clientHeight,c.object.matrix),x(2*n*i/o.clientHeight,c.object.matrix)}else c.object.isOrthographicCamera?(D(e*(c.object.right-c.object.left)/c.object.zoom/o.clientWidth,c.object.matrix),x(n*(c.object.top-c.object.bottom)/c.object.zoom/o.clientHeight,c.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),c.enablePan=!1)}}();function k(e){c.object.isPerspectiveCamera?f/=e:c.object.isOrthographicCamera?(c.object.zoom=Math.max(c.minZoom,Math.min(c.maxZoom,c.object.zoom*e)),c.object.updateProjectionMatrix(),v=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),c.enableZoom=!1)}function V(e){c.object.isPerspectiveCamera?f*=e:c.object.isOrthographicCamera?(c.object.zoom=Math.max(c.minZoom,Math.min(c.maxZoom,c.object.zoom/e)),c.object.updateProjectionMatrix(),v=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),c.enableZoom=!1)}function U(e){P.set(e.clientX,e.clientY)}function Y(e){if(!1!==c.enabled){switch(e.preventDefault(),c.domElement.focus?c.domElement.focus():window.focus(),e.button){case c.mouseButtons.LEFT:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===c.enablePan)return;U(e),p=d.PAN}else{if(!1===c.enableRotate)return;!function(e){y.set(e.clientX,e.clientY)}(e),p=d.ROTATE}break;case c.mouseButtons.MIDDLE:if(!1===c.enableZoom)return;!function(e){R.set(e.clientX,e.clientY)}(e),p=d.DOLLY;break;case c.mouseButtons.RIGHT:if(!1===c.enablePan)return;U(e),p=d.PAN}p!==d.NONE&&(document.addEventListener("mousemove",Z,!1),document.addEventListener("mouseup",z,!1),c.dispatchEvent(m))}}function Z(e){if(!1!==c.enabled)switch(e.preventDefault(),p){case d.ROTATE:if(!1===c.enableRotate)return;!function(e){O.set(e.clientX,e.clientY),w.subVectors(O,y).multiplyScalar(c.rotateSpeed);var t=c.domElement===document?c.domElement.body:c.domElement;N(2*Math.PI*w.x/t.clientHeight),S(2*Math.PI*w.y/t.clientHeight),y.copy(O),c.update()}(e);break;case d.DOLLY:if(!1===c.enableZoom)return;!function(e){L.set(e.clientX,e.clientY),M.subVectors(L,R),M.y>0?k(C()):M.y<0&&V(C()),R.copy(L),c.update()}(e);break;case d.PAN:if(!1===c.enablePan)return;!function(e){T.set(e.clientX,e.clientY),j.subVectors(T,P).multiplyScalar(c.panSpeed),H(j.x,j.y),P.copy(T),c.update()}(e)}}function z(e){!1!==c.enabled&&(document.removeEventListener("mousemove",Z,!1),document.removeEventListener("mouseup",z,!1),c.dispatchEvent(u),p=d.NONE)}function F(e){!1===c.enabled||!1===c.enableZoom||p!==d.NONE&&p!==d.ROTATE||(e.preventDefault(),e.stopPropagation(),c.dispatchEvent(m),function(e){e.deltaY<0?V(C()):e.deltaY>0&&k(C()),c.update()}(e),c.dispatchEvent(u))}function I(e){!1!==c.enabled&&!1!==c.enableKeys&&!1!==c.enablePan&&function(e){var t=!1;switch(e.keyCode){case c.keys.UP:H(0,c.keyPanSpeed),t=!0;break;case c.keys.BOTTOM:H(0,-c.keyPanSpeed),t=!0;break;case c.keys.LEFT:H(c.keyPanSpeed,0),t=!0;break;case c.keys.RIGHT:H(-c.keyPanSpeed,0),t=!0}t&&(e.preventDefault(),c.update())}(e)}function X(e){if(!1!==c.enabled){switch(e.preventDefault(),e.touches.length){case 1:if(!1===c.enableRotate)return;!function(e){y.set(e.touches[0].pageX,e.touches[0].pageY)}(e),p=d.TOUCH_ROTATE;break;case 2:if(!1===c.enableZoom&&!1===c.enablePan)return;!function(e){if(c.enableZoom){var t=e.touches[0].pageX-e.touches[1].pageX,n=e.touches[0].pageY-e.touches[1].pageY,o=Math.sqrt(t*t+n*n);R.set(0,o)}if(c.enablePan){var a=.5*(e.touches[0].pageX+e.touches[1].pageX),i=.5*(e.touches[0].pageY+e.touches[1].pageY);P.set(a,i)}}(e),p=d.TOUCH_DOLLY_PAN;break;default:p=d.NONE}p!==d.NONE&&c.dispatchEvent(m)}}function K(e){if(!1!==c.enabled)switch(e.preventDefault(),e.stopPropagation(),e.touches.length){case 1:if(!1===c.enableRotate)return;if(p!==d.TOUCH_ROTATE)return;!function(e){O.set(e.touches[0].pageX,e.touches[0].pageY),w.subVectors(O,y).multiplyScalar(c.rotateSpeed);var t=c.domElement===document?c.domElement.body:c.domElement;N(2*Math.PI*w.x/t.clientHeight),S(2*Math.PI*w.y/t.clientHeight),y.copy(O),c.update()}(e);break;case 2:if(!1===c.enableZoom&&!1===c.enablePan)return;if(p!==d.TOUCH_DOLLY_PAN)return;!function(e){if(c.enableZoom){var t=e.touches[0].pageX-e.touches[1].pageX,n=e.touches[0].pageY-e.touches[1].pageY,o=Math.sqrt(t*t+n*n);L.set(0,o),M.set(0,Math.pow(L.y/R.y,c.zoomSpeed)),k(M.y),R.copy(L)}if(c.enablePan){var a=.5*(e.touches[0].pageX+e.touches[1].pageX),i=.5*(e.touches[0].pageY+e.touches[1].pageY);T.set(a,i),j.subVectors(T,P).multiplyScalar(c.panSpeed),H(j.x,j.y),P.copy(T)}c.update()}(e);break;default:p=d.NONE}}function _(e){!1!==c.enabled&&(c.dispatchEvent(u),p=d.NONE)}function G(e){!1!==c.enabled&&e.preventDefault()}c.domElement.addEventListener("contextmenu",G,!1),c.domElement.addEventListener("mousedown",Y,!1),c.domElement.addEventListener("wheel",F,!1),c.domElement.addEventListener("touchstart",X,!1),c.domElement.addEventListener("touchend",_,!1),c.domElement.addEventListener("touchmove",K,!1),window.addEventListener("keydown",I,!1),this.update()},e.OrbitControls.prototype=Object.create(e.EventDispatcher.prototype),e.OrbitControls.prototype.constructor=e.OrbitControls,Object.defineProperties(e.OrbitControls.prototype,{center:{get:function(){return console.warn("THREE.OrbitControls: .center has been renamed to .target"),this.target}},noZoom:{get:function(){return console.warn("THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."),!this.enableZoom},set:function(e){console.warn("THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."),this.enableZoom=!e}},noRotate:{get:function(){return console.warn("THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."),!this.enableRotate},set:function(e){console.warn("THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."),this.enableRotate=!e}},noPan:{get:function(){return console.warn("THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead."),!this.enablePan},set:function(e){console.warn("THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead."),this.enablePan=!e}},noKeys:{get:function(){return console.warn("THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."),!this.enableKeys},set:function(e){console.warn("THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."),this.enableKeys=!e}},staticMoving:{get:function(){return console.warn("THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."),!this.enableDamping},set:function(e){console.warn("THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."),this.enableDamping=!e}},dynamicDampingFactor:{get:function(){return console.warn("THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."),this.dampingFactor},set:function(e){console.warn("THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."),this.dampingFactor=e}}}),module.exports=exports.default=e.OrbitControls;
},{"three":"gBK8"}],"m87a":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=s;var e=require("../constants.js"),t=d(require("./makeConstellationLines.js")),r=d(require("./LambertTextureMaterial.js")),n=i(require("three")),a=d(require("three-orbitcontrols")),o=d(require("../images"));function i(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)if(Object.prototype.hasOwnProperty.call(e,r)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,r):{};n.get||n.set?Object.defineProperty(t,r,n):t[r]=e[r]}return t.default=e,t}function d(e){return e&&e.__esModule?e:{default:e}}function s(i){var d=document.getElementById("c".concat(i)),s=d.parentNode,l=s.getBoundingClientRect(),u=l.width,c=l.height,p=u/c,h=new n.WebGLRenderer({antialias:!0,canvas:d}),v=new n.PerspectiveCamera(15,p,.1,1e4);v.position.set(0,150,400);var w=new n.Scene;w.background=new n.Color(1118481),w.add(v),h.setSize(u,c);var M=new a.default(v,s);M.enabled=!1,d.addEventListener("mouseenter",function(){M.enabled=!0}),d.addEventListener("mouseleave",function(){M.enabled=!1});var E,T=(0,t.default)(v.position.length());T.rotation.z=-e.EARTH_TILT*e.DEG,w.add(T),require("_bundle_loader")(require.resolve("/js/three/starField.js")).then(function(t){var r=t.makeStarField;(E=r(v.position.length())).rotation.z=-e.EARTH_TILT*e.DEG,w.add(E)});var f=(new n.TextureLoader).load(o.default["sun.png"]),g=new n.SpriteMaterial({map:f,depthWrite:!1}),A=new n.Sprite(g);A.scale.set(4*e.SUN_RADIUS,4*e.SUN_RADIUS,1),w.add(A);var S=new n.Mesh(new n.SphereGeometry(e.EARTH_RADIUS,30,30),(0,r.default)(o.default["earth-day.jpg"],o.default["earth-night.jpg"],{invert:!0}));w.add(S);var b=new n.Mesh(new n.CylinderGeometry(.1,.1,20,8),new n.MeshBasicMaterial({color:16777215}));w.add(b);var D=new n.Group;D.add(S),D.add(b),D.rotateOnWorldAxis(new n.Vector3(0,0,1),-e.EARTH_TILT*e.DEG);var I=new n.Mesh(new n.SphereGeometry(e.MOON_RADIUS,30,30),(0,r.default)(o.default["moon-day.jpg"],o.default["moon-night.jpg"],{invert:!0})),O=new n.Mesh(new n.TorusGeometry(e.MOON_DISTANCE,.1,16,100),new n.MeshBasicMaterial({color:e.PALETTE.MOON}));O.rotation.x=Math.PI/2;var _=new n.Group;_.add(I),_.add(O),_.rotateOnWorldAxis(new n.Vector3(1,0,1).normalize(),5.1*e.DEG);var m=new n.Group;m.add(D),m.add(_),w.add(m);var j=new n.Mesh(new n.TorusGeometry(e.EARTH_DISTANCE,.1,16,100),new n.MeshBasicMaterial({color:e.PALETTE.ECLIPTIC,side:n.DoubleSide}));j.rotation.x=Math.PI/2,w.add(j);var y=new n.DirectionalLight(16777215,1),G=new n.Object3D;G.position.set(0,0,0),w.add(G),y.target=m,y.position.set(0,0,0),w.add(y);var P=new n.GridHelper(100,10,6710886,3355443);return P.position.set(0,-e.SUN_RADIUS,0),w.add(P),{update:function(t){var r=t.positions,n=t.hide,a=r.Sun.longitude*e.DEG+Math.PI,o=r.Moon.longitude*e.DEG;P.visible=!n.grid,T.visible=!n.constellations,O.visible=!n.orbits,j.visible=!n.orbits,E&&(E.visible=!n.stars),m.position.x=e.EARTH_DISTANCE*Math.sin(a),m.position.z=e.EARTH_DISTANCE*Math.cos(a),S.rotation.y=r.Earth.rotationAngle*e.DEG+1.5*Math.PI,I.position.x=e.MOON_DISTANCE*Math.sin(o),I.position.z=e.MOON_DISTANCE*Math.cos(o),I.lookAt(m.position),I.rotateY(-Math.PI/2),h.render(w,v),M.update()},onResize:function(){var e=s.getBoundingClientRect(),t=e.width,r=e.height;v.aspect=t/r,v.updateProjectionMatrix(),h.setSize(t,r)}}}
},{"../constants.js":"MuPq","./makeConstellationLines.js":"ISnw","./LambertTextureMaterial.js":"rXcI","three":"gBK8","three-orbitcontrols":"UskU","../images":"Vn01","_bundle_loader":"z1Am","/js/three/starField.js":[["starField.07a7fabd.js","ZVbk"],"starField.07a7fabd.js.map","ZVbk"]}],"uJCF":[function(require,module,exports) {
module.exports="/nightsky/earth-day.137d723f.jpg";
},{}],"NwoG":[function(require,module,exports) {
module.exports="/nightsky/earth-night.d071c417.jpg";
},{}],"3/Zv":[function(require,module,exports) {
module.exports="/nightsky/moon-day.a794d9c8.jpg";
},{}],"n7r6":[function(require,module,exports) {
module.exports="/nightsky/moon-night.7879ce35.jpg";
},{}],"zFiX":[function(require,module,exports) {
module.exports="/nightsky/moon.3e711068.jpg";
},{}],"13XP":[function(require,module,exports) {
module.exports="/nightsky/sun.34e83b2b.png";
},{}],"Bh1I":[function(require,module,exports) {
var t=null;function e(){return t||(t=n()),t}function n(){try{throw new Error}catch(e){var t=(""+e.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);if(t)return r(t[0])}return"/"}function r(t){return(""+t).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^\/]+$/,"$1")+"/"}exports.getBundleURL=e,exports.getBaseURL=r;
},{}],"z1Am":[function(require,module,exports) {
var r=require("./bundle-url").getBundleURL;function e(r){Array.isArray(r)||(r=[r]);var e=r[r.length-1];try{return Promise.resolve(require(e))}catch(n){if("MODULE_NOT_FOUND"===n.code)return new s(function(n,i){t(r.slice(0,-1)).then(function(){return require(e)}).then(n,i)});throw n}}function t(r){return Promise.all(r.map(u))}var n={};function i(r,e){n[r]=e}module.exports=exports=e,exports.load=t,exports.register=i;var o={};function u(e){var t;if(Array.isArray(e)&&(t=e[1],e=e[0]),o[e])return o[e];var i=(e.substring(e.lastIndexOf(".")+1,e.length)||e).toLowerCase(),u=n[i];return u?o[e]=u(r()+e).then(function(r){return r&&module.bundle.register(t,r),r}).catch(function(r){throw delete o[e],r}):void 0}function s(r){this.executor=r,this.promise=null}s.prototype.then=function(r,e){return null===this.promise&&(this.promise=new Promise(this.executor)),this.promise.then(r,e)},s.prototype.catch=function(r){return null===this.promise&&(this.promise=new Promise(this.executor)),this.promise.catch(r)};
},{"./bundle-url":"Bh1I"}],"Ijyk":[function(require,module,exports) {
module.exports=function(n){return new Promise(function(e,o){var r=document.createElement("script");r.async=!0,r.type="text/javascript",r.charset="utf-8",r.src=n,r.onerror=function(n){r.onerror=r.onload=null,o(n)},r.onload=function(){r.onerror=r.onload=null,e()},document.getElementsByTagName("head")[0].appendChild(r)})};
},{}],0:[function(require,module,exports) {
var b=require("z1Am");b.register("js",require("Ijyk"));b.load([]).then(function(){require("m87a");});
},{}]},{},[0], null)
//# sourceMappingURL=/nightsky/Viz1.a8998b5e.js.map
parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"z+uS":[function(require,module,exports) {

"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=window,t=e.document,n="addEventListener",r="removeEventListener",i="getBoundingClientRect",s="_a",o="_b",a="_c",u="horizontal",l=function(){return!1},c=e.attachEvent&&!e[n],h=["","-webkit-","-moz-","-o-"].filter(function(e){var n=t.createElement("div");return n.style.cssText="width:"+e+"calc(9px)",!!n.style.length}).shift()+"calc",f=function(e){return"string"==typeof e||e instanceof String},m=function(e){if(f(e)){var n=t.querySelector(e);if(!n)throw new Error("Selector "+e+" did not match a DOM element");return n}return e},d=function(e,t,n){var r=e[t];return void 0!==r?r:n},g=function(e,t,n,r){if(t){if("end"===r)return 0;if("center"===r)return e/2}else if(n){if("start"===r)return 0;if("center"===r)return e/2}return e},v=function(e,n){var r=t.createElement("div");return r.className="gutter gutter-"+n,r},p=function(e,t,n){var r={};return f(t)?r[e]=t:r[e]=c?t+"%":h+"("+t+"% - "+n+"px)",r},y=function(e,t){var n;return(n={})[e]=t+"px",n},z=function(h,f){void 0===f&&(f={});var z,S,b,E,w,x,M=h;Array.from&&(M=Array.from(M));var k=m(M[0]).parentNode,O=getComputedStyle?getComputedStyle(k):null,U=O?O.flexDirection:null,C=d(f,"sizes")||M.map(function(){return 100/M.length}),D=d(f,"minSize",100),A=Array.isArray(D)?D:M.map(function(){return D}),_=d(f,"expandToMin",!1),j=d(f,"gutterSize",10),F=d(f,"gutterAlign","center"),B=d(f,"snapOffset",30),L=d(f,"dragInterval",1),T=d(f,"direction",u),N=d(f,"cursor",T===u?"col-resize":"row-resize"),R=d(f,"gutter",v),q=d(f,"elementStyle",p),H=d(f,"gutterStyle",y);function I(e,t,n,r){var i=q(z,t,n,r);Object.keys(i).forEach(function(t){e.style[t]=i[t]})}function P(){return x.map(function(e){return e.size})}function W(e){return"touches"in e?e.touches[0][S]:e[S]}function X(e){var t=x[this.a],n=x[this.b],r=t.size+n.size;t.size=e/this.size*r,n.size=r-e/this.size*r,I(t.element,t.size,this[o],t.i),I(n.element,n.size,this[a],n.i)}function Y(){var e=x[this.a].element,t=x[this.b].element,n=e[i](),r=t[i]();this.size=n[z]+r[z]+this[o]+this[a],this.start=n[b],this.end=n[E]}function G(e){var t=function(e){if(!getComputedStyle)return null;var t=getComputedStyle(e);if(!t)return null;var n=e[w];return 0===n?null:n-=T===u?parseFloat(t.paddingLeft)+parseFloat(t.paddingRight):parseFloat(t.paddingTop)+parseFloat(t.paddingBottom)}(k);if(null===t)return e;if(A.reduce(function(e,t){return e+t},0)>t)return e;var n=0,r=[],i=e.map(function(i,s){var o=t*i/100,a=g(j,0===s,s===e.length-1,F),u=A[s]+a;return o<u?(n+=u-o,r.push(0),u):(r.push(o-u),o)});return 0===n?e:i.map(function(e,i){var s=e;if(n>0&&r[i]-n>0){var o=Math.min(n,r[i]-n);n-=o,s=e-o}return s/t*100})}function J(i){if(!("button"in i&&0!==i.button)){var s=x[this.a].element,u=x[this.b].element;this.dragging||d(f,"onDragStart",l)(P()),i.preventDefault(),this.dragging=!0,this.move=function(e){var t,n=x[this.a],r=x[this.b];this.dragging&&(t=W(e)-this.start+(this[o]-this.dragOffset),L>1&&(t=Math.round(t/L)*L),t<=n.minSize+B+this[o]?t=n.minSize+this[o]:t>=this.size-(r.minSize+B+this[a])&&(t=this.size-(r.minSize+this[a])),X.call(this,t),d(f,"onDrag",l)())}.bind(this),this.stop=function(){var n=x[this.a].element,i=x[this.b].element;this.dragging&&d(f,"onDragEnd",l)(P()),this.dragging=!1,e[r]("mouseup",this.stop),e[r]("touchend",this.stop),e[r]("touchcancel",this.stop),e[r]("mousemove",this.move),e[r]("touchmove",this.move),this.stop=null,this.move=null,n[r]("selectstart",l),n[r]("dragstart",l),i[r]("selectstart",l),i[r]("dragstart",l),n.style.userSelect="",n.style.webkitUserSelect="",n.style.MozUserSelect="",n.style.pointerEvents="",i.style.userSelect="",i.style.webkitUserSelect="",i.style.MozUserSelect="",i.style.pointerEvents="",this.gutter.style.cursor="",this.parent.style.cursor="",t.body.style.cursor=""}.bind(this),e[n]("mouseup",this.stop),e[n]("touchend",this.stop),e[n]("touchcancel",this.stop),e[n]("mousemove",this.move),e[n]("touchmove",this.move),s[n]("selectstart",l),s[n]("dragstart",l),u[n]("selectstart",l),u[n]("dragstart",l),s.style.userSelect="none",s.style.webkitUserSelect="none",s.style.MozUserSelect="none",s.style.pointerEvents="none",u.style.userSelect="none",u.style.webkitUserSelect="none",u.style.MozUserSelect="none",u.style.pointerEvents="none",this.gutter.style.cursor=N,this.parent.style.cursor=N,t.body.style.cursor=N,Y.call(this),this.dragOffset=W(i)-this.end}}T===u?(z="width",S="clientX",b="left",E="right",w="clientWidth"):"vertical"===T&&(z="height",S="clientY",b="top",E="bottom",w="clientHeight"),C=G(C);var K=[];function Q(e){var t=e.i===K.length,n=t?K[e.i-1]:K[e.i];Y.call(n);var r=t?n.size-e.minSize-n[a]:e.minSize+n[o];X.call(n,r)}function V(e){var t=G(e);t.forEach(function(e,n){if(n>0){var r=K[n-1],i=x[r.a],s=x[r.b];i.size=t[n-1],s.size=e,I(i.element,i.size,r[o],i.i),I(s.element,s.size,r[a],s.i)}})}function Z(e,t){K.forEach(function(n){if(!0!==t?n.parent.removeChild(n.gutter):(n.gutter[r]("mousedown",n[s]),n.gutter[r]("touchstart",n[s])),!0!==e){var i=q(z,n.a.size,n[o]);Object.keys(i).forEach(function(e){x[n.a].element.style[e]="",x[n.b].element.style[e]=""})}})}return(x=M.map(function(e,t){var r,i={element:m(e),size:C[t],minSize:A[t],i:t};if(t>0&&((r={a:t-1,b:t,dragging:!1,direction:T,parent:k})[o]=g(j,t-1==0,!1,F),r[a]=g(j,!1,t===M.length-1,F),"row-reverse"===U||"column-reverse"===U)){var u=r.a;r.a=r.b,r.b=u}if(!c&&t>0){var l=R(t,T,i.element);!function(e,t,n){var r=H(z,t,n);Object.keys(r).forEach(function(t){e.style[t]=r[t]})}(l,j,t),r[s]=J.bind(r),l[n]("mousedown",r[s]),l[n]("touchstart",r[s]),k.insertBefore(l,i.element),r.gutter=l}return I(i.element,i.size,g(j,0===t,t===M.length-1,F),t),t>0&&K.push(r),i})).forEach(function(e){var t=e.element[i]()[z];t<e.minSize&&(_?Q(e):e.minSize=t)}),c?{setSizes:V,destroy:Z}:{setSizes:V,getSizes:P,collapse:function(e){Q(x[e])},destroy:Z,parent:k,pairs:K}},S=z;exports.default=S;
},{}]},{},["z+uS"], null)
//# sourceMappingURL=/nightsky/split.es.65bb222a.js.map
import {
  DEG,
  EARTH_DISTANCE,
  EARTH_RADIUS,
  MOON_RADIUS,
  EARTH_TILT,
  PALETTE,
  SUN_RADIUS
} from '../constants.js';
import * as THREE from 'three';
import makeGraticule from '../d3/graticule.js';
import makeConstellationLines from './makeConstellationLines.js';
// import makeStarField from '/js/three/starField.js';
import LambertTextureMaterial from './LambertTextureMaterial.js';

import images from '../images';
import makeRing from './makeRing.js';

export default function Viz(index) {
  const canvas = document.getElementById(`c${index}`);
  const container = canvas.parentNode;
  const BCR = container.getBoundingClientRect();

  // Set the scene size.
  const WIDTH = BCR.width;
  const HEIGHT = BCR.height;

  // Set some camera attributes.
  const VIEW_ANGLE = 15;
  const ASPECT = WIDTH / HEIGHT;
  const NEAR = 0.1;
  const FAR = 10000;

  // Create a WebGL renderer, camera
  // and a scene
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas
  });

  const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  camera.position.set(0, 150, 400);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);
  scene.add(camera);
  renderer.setSize(WIDTH, HEIGHT);

  var controls = new THREE.OrbitControls(camera, container);
  controls.enabled = false;

  canvas.addEventListener('mouseenter', () => {
    controls.enabled = true;
  });

  canvas.addEventListener('mouseleave', () => {
    controls.enabled = false;
  });

  var sun = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.TextureLoader().load(images['sun.png']),
      depthWrite: false
    })
  );
  sun.scale.set(SUN_RADIUS * 2, SUN_RADIUS * 2, 1);
  scene.add(sun);

  var earth = new THREE.Mesh(
    new THREE.SphereGeometry(EARTH_RADIUS, 30, 30),
    LambertTextureMaterial(images['earth-day.jpg'], images['earth-night.jpg'])
  );
  scene.add(earth);

  const northPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 20, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  scene.add(northPole);

  var eclipticPlane = makeRing({
    distance: EARTH_DISTANCE,
    width: 1 * DEG,
    color: PALETTE.ECLIPTIC
  });

  var moon = new THREE.Mesh(
    new THREE.SphereGeometry(MOON_RADIUS * 2, 30, 30),
    LambertTextureMaterial(images['moon-day.jpg'], images['moon-night.jpg'])
  );

  var moonOrbit = makeRing({
    distance: EARTH_DISTANCE,
    color: PALETTE.MOON
  });

  const moonTilt = new THREE.Object3D();
  moonTilt.add(moon);
  moonTilt.add(moonOrbit);

  moonTilt.rotateOnWorldAxis(new THREE.Vector3(1, 0, 1).normalize(), 5.1 * DEG);

  // eclipticPlane.rotation.x = Math.PI / 2;

  const ecliptic = new THREE.Object3D();
  ecliptic.add(sun);
  ecliptic.add(moonTilt);
  ecliptic.add(eclipticPlane);
  ecliptic.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), -EARTH_TILT * DEG);
  scene.add(ecliptic);

  var light = new THREE.DirectionalLight(0xffffff, 1);
  var targetObject = new THREE.Object3D();
  targetObject.position.set(0, 0, 0);
  scene.add(targetObject);

  light.target = sun;
  light.position.set(0, 0, 0);
  scene.add(light);

  const graticule = makeGraticule(EARTH_DISTANCE, 0x666666, {
    material: { opacity: 0.1 }
  });
  scene.add(graticule);

  const constellations = makeConstellationLines(EARTH_DISTANCE);
  scene.add(constellations);

  var equator = makeRing({
    distance: EARTH_DISTANCE,
    width: 2 * DEG,
    color: PALETTE.EQUATOR
  });

  scene.add(equator);

  import('/js/three/starField.js').then(({ makeStarField }) => {
    scene.add(
      makeStarField(EARTH_DISTANCE, {
        maxSize: 1,
        dot: true,
        // additive: true,
        scalePoint: mag => 3 * Math.exp(-0.2 * mag),
        fadePoint: mag => Math.exp(-8 * (mag - 2))
        // scalePoint: mag => 2
      })
    );
  });

  return {
    update({ positions, hide }) {
      const sunLong = positions.Sun.longitude * DEG + Math.PI;
      const moonLong = positions.Moon.longitude * DEG + Math.PI;

      constellations.visible = !hide.constellations;
      moonOrbit.visible = !hide.orbits;
      eclipticPlane.visible = !hide.orbits;
      graticule.visible = !hide.equator;
      equator.visible = !hide.equator;

      sun.position.x = EARTH_DISTANCE * Math.sin(sunLong);
      sun.position.z = EARTH_DISTANCE * Math.cos(sunLong);

      // pi/2 correction for shader texture
      earth.rotation.y = positions.Earth.rotationAngle * DEG + Math.PI * 0.5;

      moon.position.x = EARTH_DISTANCE * Math.sin(moonLong);
      moon.position.z = EARTH_DISTANCE * Math.cos(moonLong);
      moon.lookAt(earth.position);
      moon.rotateY(-Math.PI / 2);

      renderer.render(scene, camera);
      controls.update();
    },

    onResize() {
      const BCR1 = container.getBoundingClientRect();
      const WIDTH = BCR1.width;
      const HEIGHT = BCR1.height;

      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
      renderer.setSize(WIDTH, HEIGHT);
    }
  };
}

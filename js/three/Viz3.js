import {
  DEG,
  EARTH_DISTANCE,
  EARTH_TILT,
  MOON_RADIUS,
  SUN_RADIUS,
  PALETTE
} from '../constants.js';
import * as THREE from 'three';
import makeGraticule from '../d3/graticule.js';
import makeHorizon from '../d3/horizon.js';
import makeConstellationLines from './makeConstellationLines.js';
// import makeStarField from '/js/three/starField.js';
import LambertTextureMaterial from './LambertTextureMaterial.js';

import images from '../images';

export default function Viz(index) {
  const canvas = document.getElementById(`c${index}`);
  const container = canvas.parentNode;
  const BCR = container.getBoundingClientRect();

  // Set the scene size.
  const WIDTH = BCR.width;
  const HEIGHT = BCR.height;

  // coordsInput.

  // Set some camera attributes.
  const VIEW_ANGLE = 15;
  const ASPECT = WIDTH / HEIGHT;
  const NEAR = 0.1;
  const FAR = 10000;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas
  });

  const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  camera.position.set(200, 150, 200);
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

  const celestialSphere = new THREE.Object3D();

  var ground = new THREE.Mesh(
    new THREE.CircleGeometry(EARTH_DISTANCE, 64),
    new THREE.MeshBasicMaterial({
      color: 0xaa0000,
      // color: PALETTE.GROUND,
      transparent: true,
      opacity: 0.6
    })
  );

  scene.add(ground);
  ground.renderOrder = 1;
  ground.rotation.x = -Math.PI / 2;

  const underground = ground.clone();

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

  var sunMap = new THREE.TextureLoader().load(images['sun.png']);
  var sunMaterial = new THREE.SpriteMaterial({
    map: sunMap,
    depthWrite: false
  });
  var sun = new THREE.Sprite(sunMaterial);
  sun.scale.set(SUN_RADIUS * 2, SUN_RADIUS * 2, 1);
  celestialSphere.add(sun);

  var eclipticPlane = new THREE.Mesh(
    new THREE.TorusGeometry(EARTH_DISTANCE, 0.1, 16, 100),
    new THREE.MeshBasicMaterial({
      color: PALETTE.ECLIPTIC,
      side: THREE.DoubleSide
    })
  );

  eclipticPlane.rotation.x = Math.PI / 2;
  // celestialSphere.add(mesh);

  var moon = new THREE.Mesh(
    new THREE.SphereGeometry(MOON_RADIUS * 2, 30, 30),
    LambertTextureMaterial(images['moon-day.jpg'], images['moon-night.jpg'])
  );

  var moonOrbit = new THREE.Mesh(
    new THREE.TorusGeometry(EARTH_DISTANCE, 0.1, 16, 100),
    new THREE.MeshBasicMaterial({
      color: PALETTE.MOON
      // side: THREE.DoubleSide
    })
  );
  moonOrbit.rotation.x = Math.PI / 2;

  const moonTilt = new THREE.Object3D();
  moonTilt.add(moon);
  moonTilt.add(moonOrbit);

  moonTilt.rotateOnWorldAxis(new THREE.Vector3(1, 0, 1).normalize(), 5.1 * DEG);

  eclipticPlane.rotation.x = Math.PI / 2;

  const ecliptic = new THREE.Object3D();
  ecliptic.add(sun);
  ecliptic.add(moonTilt);
  ecliptic.add(eclipticPlane);
  ecliptic.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), -EARTH_TILT * DEG);
  celestialSphere.add(ecliptic);

  var light = new THREE.DirectionalLight(0xffffff, 1);
  var targetObject = new THREE.Object3D();
  targetObject.position.set(0, 0, 0);
  celestialSphere.add(targetObject);

  light.target = sun;
  light.position.set(0, 0, 0);
  celestialSphere.add(light);

  const graticule = makeGraticule(EARTH_DISTANCE);
  celestialSphere.add(graticule);

  const constellations = makeConstellationLines(EARTH_DISTANCE);
  celestialSphere.add(constellations);

  var equator = new THREE.Mesh(
    new THREE.TorusGeometry(EARTH_DISTANCE, 0.2, 16, 100),
    new THREE.MeshBasicMaterial({
      color: PALETTE.EQUATOR,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    })
  );
  equator.rotation.x = Math.PI / 2;
  celestialSphere.add(equator);

  scene.add(celestialSphere);

  const horizon = makeHorizon(EARTH_DISTANCE);
  scene.add(horizon);

  const northSouth = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, EARTH_DISTANCE * 2, 8),
    new THREE.MeshBasicMaterial({ color: PALETTE.HORIZON })
  );

  northSouth.rotation.x = Math.PI / 2;

  scene.add(northSouth);

  const eastWest = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, EARTH_DISTANCE * 2, 8),
    new THREE.MeshBasicMaterial({ color: PALETTE.HORIZON })
  );

  eastWest.rotation.z = Math.PI / 2;

  scene.add(eastWest);

  const height = 10;

  const observer = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, height, 8),
    new THREE.MeshBasicMaterial({ color: PALETTE.HORIZON })
  );

  observer.position.set(0, height / 2, 0);

  scene.add(observer);

  import('/js/three/starField.js').then(({ makeStarField }) => {
    const starField = makeStarField(EARTH_DISTANCE, {
      maxSize: 1,
      dot: true,
      additive: true,
      scalePoint: mag => 3 * Math.exp(-0.2 * mag)
    });
    celestialSphere.add(starField);
  });

  // celestialSphere.add(makeStarField(EARTH_DISTANCE));

  return {
    update({ positions, hide, location }) {
      const sunLong = positions.Sun.longitude * DEG + Math.PI;
      const moonLong = positions.Moon.longitude * DEG + Math.PI;

      constellations.visible = !hide.constellations;
      moonOrbit.visible = !hide.orbits;
      eclipticPlane.visible = !hide.orbits;
      graticule.visible = !hide.equator;
      equator.visible = !hide.equator;
      horizon.visible = !hide.horizon;

      sun.position.x = EARTH_DISTANCE * Math.sin(sunLong);
      sun.position.z = EARTH_DISTANCE * Math.cos(sunLong);

      celestialSphere.rotation.x = (90 - location.lat) * DEG;
      celestialSphere.rotation.y =
        -location.long * DEG - positions.Earth.rotationAngle * DEG;

      moon.position.x = EARTH_DISTANCE * Math.sin(moonLong);
      moon.position.z = EARTH_DISTANCE * Math.cos(moonLong);
      moon.lookAt(ground.position);
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
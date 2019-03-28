import { path } from '../path.js';
import { getMoonLongitude } from '../astro/moon.js';
import { getSunLongitude } from '../astro/sun.js';
import { ERA } from '../astro/earth.js';
import {
  DEG,
  EARTH_DISTANCE,
  EARTH_TILT,
  MOON_RADIUS,
  SUN_RADIUS,
  PALETTE
} from '../constants.js';
import makeGraticule from '../d3/graticule.js';
import makeHorizon from '../d3/horizon.js';
import makeConstellationLines from './makeConstellationLines.js';
import LambertTextureMaterial from './LambertTextureMaterial.js';

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
      color: PALETTE.GROUND,
      side: THREE.DoubleSide,
      transparent: true
    })
  );

  scene.add(ground);
  ground.rotation.x = Math.PI / 2;

  var sunMap = new THREE.TextureLoader().load(path + '/img/sun.png');
  var sunMaterial = new THREE.SpriteMaterial({ map: sunMap });
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
    new THREE.SphereGeometry(MOON_RADIUS, 30, 30),
    LambertTextureMaterial(path + '/img/moon-day.jpg', path + '/img/moon-night.jpg')
  );

  var moonOrbit = new THREE.Mesh(
    new THREE.TorusGeometry(EARTH_DISTANCE, 0.1, 16, 100),
    new THREE.MeshBasicMaterial({
      color: PALETTE.MOON,
      side: THREE.DoubleSide
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
      side: THREE.DoubleSide
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

  return {
    update({ t, hide, location }) {
      const sunLong = getSunLongitude(t) + Math.PI;
      const moonLong = getMoonLongitude(t) + Math.PI;

      constellations.visible = !hide.constellations;
      moonOrbit.visible = !hide.orbits;
      eclipticPlane.visible = !hide.orbits;
      graticule.visible = !hide.equator;
      equator.visible = !hide.equator;
      horizon.visible = !hide.horizon;

      sun.position.x = EARTH_DISTANCE * Math.sin(sunLong);
      sun.position.z = EARTH_DISTANCE * Math.cos(sunLong);

      celestialSphere.rotation.x = (90 - location.lat) * DEG;
      celestialSphere.rotation.y = -location.long * DEG - ERA(t);

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

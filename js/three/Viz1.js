import { path } from '../path.js';
import {
  DEG,
  DAYS,
  EARTH_DISTANCE,
  EARTH_RADIUS,
  EARTH_TILT,
  MOON_DISTANCE,
  MOON_RADIUS,
  SUN_RADIUS,
  PALETTE
} from '../constants.js';
import makeConstellationLines from './makeConstellationLines.js';
import makeStarField from './starField.js';

import LambertTextureMaterial from './LambertTextureMaterial.js';

export default function Viz(index) {
  const c1 = document.getElementById(`c${index}`);
  const container1 = c1.parentNode;
  const BCR1 = container1.getBoundingClientRect();

  // Set the scene size.
  const WIDTH = BCR1.width;
  const HEIGHT = BCR1.height;

  // Set some camera attributes.
  const VIEW_ANGLE = 15;
  const ASPECT = WIDTH / HEIGHT;
  const NEAR = 0.1;
  const FAR = 10000;

  // Create a WebGL renderer, camera
  // and a scene
  const renderer1 = new THREE.WebGLRenderer({
    antialias: true,
    canvas: c1
  });

  const camera1 = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

  camera1.position.set(0, 150, 400);

  const scene = new THREE.Scene();

  scene.background = new THREE.Color(0x111111);

  // Add the camera to the scene.
  scene.add(camera1);

  // Start the renderer.
  renderer1.setSize(WIDTH, HEIGHT);

  // Attach the renderer-supplied
  // DOM element.

  var controls1 = new THREE.OrbitControls(camera1, container1);
  controls1.enabled = false;

  c1.addEventListener('mouseenter', () => {
    controls1.enabled = true;
  });
  c1.addEventListener('mouseleave', () => {
    controls1.enabled = false;
  });

  const constellations = makeConstellationLines(camera1.position.length());
  constellations.rotation.z = -EARTH_TILT * DEG;
  scene.add(constellations);

  const starField = makeStarField(camera1.position.length());
  starField.rotation.z = -EARTH_TILT * DEG;
  scene.add(starField);

  var sunMap = new THREE.TextureLoader().load(path + '/img/sun.png');
  var sunMaterial = new THREE.SpriteMaterial({ map: sunMap });
  var sun = new THREE.Sprite(sunMaterial);
  sun.scale.set(SUN_RADIUS * 4, SUN_RADIUS * 4, 1);
  scene.add(sun);

  var earth = new THREE.Mesh(
    new THREE.SphereGeometry(EARTH_RADIUS, 30, 30),
    LambertTextureMaterial(
      path + '/img/earth-day.jpg',
      path + '/img/earth-night.jpg',
      {
        invert: true
      }
    )
  );
  scene.add(earth);

  const northPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 20, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  scene.add(northPole);

  const earthTilt = new THREE.Group();
  earthTilt.add(earth);
  earthTilt.add(northPole);
  earthTilt.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), -EARTH_TILT * DEG);

  var moon = new THREE.Mesh(
    new THREE.SphereGeometry(MOON_RADIUS, 30, 30),
    LambertTextureMaterial(
      path + '/img/moon-day.jpg',
      path + '/img/moon-night.jpg',
      {
        invert: true
      }
    )
  );

  var moonOrbit = new THREE.Mesh(
    new THREE.TorusGeometry(MOON_DISTANCE, 0.1, 16, 100),
    new THREE.MeshBasicMaterial({
      color: PALETTE.MOON
    })
  );

  moonOrbit.rotation.x = Math.PI / 2;

  const moonTilt = new THREE.Group();
  moonTilt.add(moon);
  moonTilt.add(moonOrbit);
  moonTilt.rotateOnWorldAxis(new THREE.Vector3(1, 0, 1).normalize(), 5.1 * DEG);

  var groupEarthMoon = new THREE.Group();
  groupEarthMoon.add(earthTilt);
  groupEarthMoon.add(moonTilt);
  scene.add(groupEarthMoon);

  var earthOrbit = new THREE.Mesh(
    new THREE.TorusGeometry(EARTH_DISTANCE, 0.1, 16, 100),
    new THREE.MeshBasicMaterial({
      color: PALETTE.ECLIPTIC,
      side: THREE.DoubleSide
    })
  );
  earthOrbit.rotation.x = Math.PI / 2;
  scene.add(earthOrbit);

  var light = new THREE.DirectionalLight(0xffffff, 1);
  var targetObject = new THREE.Object3D();
  targetObject.position.set(0, 0, 0);
  scene.add(targetObject);

  light.target = groupEarthMoon;
  light.position.set(0, 0, 0);
  scene.add(light);

  var gridXZ = new THREE.GridHelper(100, 10, 0x666666, 0x333333);
  gridXZ.position.set(0, -SUN_RADIUS, 0);
  scene.add(gridXZ);

  // var gridXY = new THREE.GridHelper(100, 10, 0x666666, 0x333333);
  // gridXY.position.set(0, 0, -50);
  // gridXY.rotation.x = Math.PI / 2;
  // scene.add(gridXY);

  // var gridYZ = new THREE.GridHelper(100, 10, 0x666666, 0x333333);
  // gridYZ.position.set(-50, 0, 0);
  // gridYZ.rotation.z = Math.PI / 2;
  // scene.add(gridYZ);

  return {
    update({ positions, hide }) {
      const sunLong = positions.Sun.longitude * DEG + Math.PI;
      const moonLong = positions.Moon.longitude * DEG;

      gridXZ.visible = !hide.grid;
      constellations.visible = !hide.constellations;
      moonOrbit.visible = !hide.orbits;
      earthOrbit.visible = !hide.orbits;
      starField.visible = !hide.stars;

      groupEarthMoon.position.x = EARTH_DISTANCE * Math.sin(sunLong);
      groupEarthMoon.position.z = EARTH_DISTANCE * Math.cos(sunLong);
      earth.rotation.y = positions.Earth.rotationAngle * DEG + Math.PI * 1.5;

      // light.target = groupEarthMoon;
      // light.position.set(groupEarthMoon.position);

      moon.position.x = MOON_DISTANCE * Math.sin(moonLong);
      moon.position.z = MOON_DISTANCE * Math.cos(moonLong);
      moon.lookAt(groupEarthMoon.position);
      moon.rotateY(-Math.PI / 2);

      renderer1.render(scene, camera1);

      // required if controls.enableDamping or controls.autoRotate are set to true
      controls1.update();
    },

    onResize() {
      const BCR1 = container1.getBoundingClientRect();

      // Set the scene size.
      const WIDTH = BCR1.width;
      const HEIGHT = BCR1.height;

      camera1.aspect = WIDTH / HEIGHT;
      camera1.updateProjectionMatrix();

      renderer1.setSize(WIDTH, HEIGHT);
    }
  };
}

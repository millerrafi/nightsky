import { path } from '../path.js';
import { getMoonLongitude } from '../astro/moon.js';
import { getSunLongitude } from '../astro/sun.js';
import { ERA } from '../astro/earth.js';
import {
  DEG,
  EARTH_DISTANCE,
  EARTH_RADIUS,
  MOON_RADIUS,
  EARTH_TILT,
  PALETTE,
  SUN_RADIUS
} from '../constants.js';
import makeGraticule from '../d3/graticule.js';
import makeConstellationLines from './makeConstellationLines.js';
import wireframe from '../d3/wireframe.js';
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
      map: new THREE.TextureLoader().load(path + '/img/sun.png')
    })
  );
  sun.scale.set(SUN_RADIUS * 2, SUN_RADIUS * 2, 1);
  scene.add(sun);

  var earth = new THREE.Mesh(
    new THREE.SphereGeometry(EARTH_RADIUS, 30, 30),
    LambertTextureMaterial(
      path + '/img/earth-day.jpg',
      path + '/img/earth-night.jpg'
    )
  );
  scene.add(earth);

  const northPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 20, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  scene.add(northPole);

  var eclipticPlane = new THREE.Mesh(
    new THREE.TorusGeometry(EARTH_DISTANCE, 0.1, 16, 100),
    new THREE.MeshBasicMaterial({
      color: PALETTE.ECLIPTIC,
      side: THREE.DoubleSide
    })
  );
  eclipticPlane.rotation.x = Math.PI / 2;

  var moon = new THREE.Mesh(
    new THREE.SphereGeometry(MOON_RADIUS, 30, 30),
    LambertTextureMaterial(
      path + '/img/moon-day.jpg',
      path + '/img/moon-night.jpg'
    )
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

  var equator = new THREE.Mesh(
    new THREE.TorusGeometry(EARTH_DISTANCE, 0.1, 16, 100),
    new THREE.MeshBasicMaterial({
      color: PALETTE.EQUATOR,
      side: THREE.DoubleSide
    })
  );

  equator.rotation.x = Math.PI / 2;
  scene.add(equator);

  return {
    update({ t, hide }) {
      const sunLong = getSunLongitude(t) + Math.PI;
      const moonLong = getMoonLongitude(t) + Math.PI;

      constellations.visible = !hide.constellations;
      moonOrbit.visible = !hide.orbits;
      eclipticPlane.visible = !hide.orbits;
      graticule.visible = !hide.equator;
      equator.visible = !hide.equator;

      sun.position.x = EARTH_DISTANCE * Math.sin(sunLong);
      sun.position.z = EARTH_DISTANCE * Math.cos(sunLong);

      // pi/2 correction for shader texture
      earth.rotation.y = ERA(t) + Math.PI * 0.5;

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

/* eslint-disable */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const getImageUrl = (url?: string) => {
  if (!url) {
    return 'preview.jpg';
  }
  return `${window.location.origin}/images/star/${
    url ? url?.substring(url?.lastIndexOf('/') + 1) : '36.jpg'
  }`;
};
1;
// var renderer,
//   scene: THREE.Scene,
//   camera,
//   composer,
//   circle: THREE.Object3D,
//   geo_planet: THREE.SphereGeometry,
//   particle,
//   luminor,
//   halo,
//   galaxy,
//   width,
//   height;
// var lights = [];
// var timer = null;

const useGrowThree = (dom: Element, url?: string) => {
  const state = useRef({
    renderer: null,
    scene: null,
    camera: null,
    composer: null,
    circle: null,
    geo_planet: null,
    particle: null,
    luminor: null,
    halo: null,
    galaxy: null,
    width: 800,
    height: 800,
    lights: [],
    timer: null,
  });

  useEffect(() => {
    if (dom) {
      // const src = getImageUrl(url);
      init(url);
      // if (timer) {
      //   cancelAnimationFrame(timer);
      // }
      if (!state.current.timer) {
        animate();
      }
    }

    return () => {
      if (state.current.timer) {
        cancelAnimationFrame(state.current.timer);
      }
    };
  }, [dom]);

  function init(textureSrc) {
    state.current.width = dom.clientWidth;
    state.current.height = dom.clientHeight;
    state.current.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    const { renderer, width, height } = state.current;
    renderer.setPixelRatio(
      window.devicePixelRatio ? window.devicePixelRatio : 1,
    );
    renderer.setSize(width, height);
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0);
    dom.appendChild(renderer.domElement);

    state.current.scene = new THREE.Scene();
    state.current.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      1,
      1000,
    );

    const { camera, scene } = state.current;
    camera.position.z = 400;
    scene.add(camera);

    state.current.circle = new THREE.Object3D();
    state.current.particle = new THREE.Object3D();
    state.current.halo = new THREE.Object3D();
    state.current.luminor = new THREE.Object3D();

    const { circle, particle, halo, luminor, lights } = state.current;
    scene.add(circle);
    scene.add(particle);
    scene.add(halo);
    scene.add(luminor);

    var geometry = new THREE.TetrahedronGeometry(1, 1);
    state.current.geo_planet = new THREE.SphereGeometry(10, 64, 32);
    var geom3 = new THREE.SphereGeometry(16, 32, 16);
    var geo_star = new THREE.SphereGeometry(90, 64, 64);

    var material = new THREE.MeshPhongMaterial({
      color: 0x111111,
      flatShading: false,
      // flatShading: THREE.FlatShading,
    });

    for (var i = 0; i < 500; i++) {
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position
        .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        .normalize();
      mesh.position.multiplyScalar(200 + Math.random() * 500);
      mesh.rotation.set(
        Math.random() * 2,
        Math.random() * 2,
        Math.random() * 2,
      );
      particle.add(mesh);
    }

    // 生成球体
    const mat = createPlanet(textureSrc);

    var mat3 = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader:
        'varying vec3 vNormal; void main() { vNormal = normalize( normalMatrix * normal ); gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }',
      fragmentShader:
        'varying vec3 vNormal; void main() { float intensity = pow( 0.7 - dot( vNormal, vec3( 0.0, 0.0, 0.5 ) ), 4.0 ); gl_FragColor = vec4( 1.3, 1.0, 1.0, 1.0 ) * intensity; }',
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });

    // var planet = new THREE.Mesh(geo_planet, mat);
    // planet.scale.x = planet.scale.y = planet.scale.z = 15;
    // circle.add(planet);

    var ball = new THREE.Mesh(geom3, mat3);
    ball.scale.x = ball.scale.y = ball.scale.z = 16;
    halo.add(ball);

    var ball2 = new THREE.Mesh(geom3, mat3);
    ball2.scale.x = ball2.scale.y = ball2.scale.z = 12;
    ball2.position.set(25, 5, 1);
    halo.add(ball2);

    var ambientLight = new THREE.AmbientLight(0x000000);
    scene.add(ambientLight);

    var hemiLight = new THREE.HemisphereLight(0x090909, 0x1111111, 20);
    hemiLight.position.set(-1, -1, 2);
    luminor.add(hemiLight);

    lights[1] = new THREE.DirectionalLight(0x000000, 7);
    lights[1].position.set(-1, 0, 0.5);
    lights[2] = new THREE.DirectionalLight(0x000000, 7);
    lights[2].position.set(1, 0, 0.5);

    scene.add(lights[1]);
    scene.add(lights[2]);
  }

  function createPlanet(url: string) {
    const { circle, geo_planet } = state.current;
    if (circle) {
      circle.clear();
      const textureSrc = getImageUrl(url);
      // console.log('textureSrc', textureSrc);

      const mat = new THREE.MeshPhongMaterial({
        color: 0xcea3a3,
        emissive: 0x000000,
        //shading: THREE.FlatShading,
        // flatShading: THREE.SmoothShading,
        bumpScale: 0.025,
        map: new THREE.TextureLoader().load(textureSrc),
        bumpMap: new THREE.TextureLoader().load(textureSrc),
        specularMap: new THREE.TextureLoader().load(textureSrc),
        specular: new THREE.Color('grey'),
      });
      var planet = new THREE.Mesh(geo_planet, mat);

      planet.scale.x = planet.scale.y = planet.scale.z = 15;
      circle.add(planet);
    }
  }

  function animate() {
    const { circle, particle, halo, luminor, renderer, scene, camera } =
      state.current;
    var timer = 0.0001 * Date.now();
    timer = requestAnimationFrame(animate);

    particle.rotation.x += 0.0;
    particle.rotation.y -= 0.004;
    // circle.rotation.x -= 0.001;
    circle.rotation.y -= 0.001;
    // circle?.scale?.set(
    //   circle?.scale.x + 0.001,
    //   circle?.scale.x + 0.001,
    //   circle?.scale.x + 0.001,
    // );
    halo.rotation.z -= 0.005;
    luminor.rotation.z -= 0.005;
    //halo.scale.x = Math.sin( timer * 3) * 0.09 + 1;
    //halo.scale.y = Math.sin( timer * 7 ) * 0.09 + 1;

    renderer.clear();
    renderer.render(scene, camera);
  }

  return { createPlanet };
};

export default useGrowThree;

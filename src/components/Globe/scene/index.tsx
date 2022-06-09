import React, { Suspense, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
// import { useHelper } from "@react-three/drei";
import { SpotLightHelper } from 'three';
import CustoCamera from '../custom-camera';
import Earth from '../earth';

const spotlightConfig: any = {
  showHelper: {
    value: false,
  },
  intensity: {
    value: 1.2,
    min: 0,
    max: 3,
  },
  color: {
    value: '#ffffff',
  },
  position: {
    value: [-26, 11, -11],
  },
  angle: {
    value: 0.2,
    min: 0,
    max: 1,
  },
  castShadow: {
    value: false,
  },
  penumbra: {
    value: 0.4,
    min: 0,
    max: 1,
  },
  distance: {
    value: 58,
    min: 0,
    max: 300,
  },
  decay: {
    value: 1,
    min: 0,
    max: 2,
  },
};
const Scene = function ({ ...props }) {
  const earthGrounpRef = useRef(null);
  const spotLightRef = useRef<any>(null);

  // @ts-ignore
  // const spotlightProps = useControls({
  //   spotLight: folder(spotlightConfig),
  // });

  useEffect(() => {
    // ..
  });

  // useHelper(spotLightRef, spotlightProps.showHelper ? SpotLightHelper : null);

  useFrame((state, delta) => {
    if (earthGrounpRef.current) {
      earthGrounpRef.current.rotation.y += 0.01;
    }
  });
  return (
    <>
      <CustoCamera
        position={[0, 0, -35]}
        fov={40}
        near={0.1}
        far={1000}
        name='per-camera'
      >
        <spotLight
          ref={spotLightRef}
          // {...spotlightProps}
          // shadow-camera-near={50}
          // shadow-camera-far={200}
          // shadow-camera-fov={35}
          // shadow-mapSize-width={2048}
          // shadow-mapSize-height={2048}
        />
      </CustoCamera>
      <ambientLight intensity={0.8} color='#393939' />
      <Suspense fallback={null}>
        <group ref={earthGrounpRef}>
          <Earth {...props} scale={2} postion={[0, 0, 0]} />
        </group>
      </Suspense>
    </>
  );
};

export default Scene;

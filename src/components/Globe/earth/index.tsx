import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';

import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { Color, Mesh } from 'three';

import GlowMesh from './GlowMesh';

const Earth = function ({ url, ...props }: any) {
  const earthMesh = useRef<Mesh>(null);

  useEffect(() => {
    // ..
  }, []);

  useFrame((state, delta) => {
    // earthMesh.current.rotation.y += 0.01
  });

  const img = `${window.location.origin}/images/star${
    url ? url?.substring(url?.lastIndexOf('/')) : '36.jpg'
  }`;

  const textureMap = useLoader(TextureLoader, img);

  return (
    <mesh {...props} ref={earthMesh}>
      <sphereGeometry args={[5, 40, 40]} />
      {/* @ts-ignore */}
      <meshPhongMaterial
        transparent
        map={textureMap}
        shininess={5}
        attach='material'
      />
      <GlowMesh {...props} scale={[1.2, 1.2, 1.2]} />
    </mesh>
  );
};

export default Earth;

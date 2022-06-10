import React, { useRef } from 'react';
import { Color, AdditiveBlending, BackSide } from 'three';
import { DefaultTheme } from 'styled-components';
import getThemeValue from 'uikit/util/getThemeValue';
import useTheme from 'hooks/useTheme';

import '../glow-shader-material/shader-material';
import { GlobeProps } from '..';

interface GlowMeshProps extends GlobeProps {
  theme: DefaultTheme;
}

const getColor = ({ shadow, theme }) => {
  return getThemeValue(`colors.${shadow}`, shadow)(theme);
};

const GlowMesh: React.FC<GlowMeshProps> = ({
  shadow,
  theme,
  ...props
}: any) => {
  const glowRef = useRef<any>(null);
  const color = getColor({ shadow, theme });
  if (!shadow) return null;
  return (
    <mesh ref={glowRef} {...props}>
      <sphereGeometry args={[5, 40, 40]} />
      {/* @ts-ignore */}
      <glowShaderMaterial
        attach='material'
        c={0.4}
        p={8}
        glowColor={new Color(color)}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        side={BackSide}
      />
    </mesh>
  );
};

export default GlowMesh;

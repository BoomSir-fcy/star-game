import { Filter, Texture } from '@pixi/core';

const fragment = `
varying vec2 vTextureCoord;

uniform vec2 size;
uniform sampler2D uSampler, backdropSampler;
uniform vec2 backdropSampler_flipY;
uniform highp vec4 inputSize;
uniform highp vec4 outputFrame;

vec2 mapCoord( vec2 coord )
{
    return coord * inputSize.xy + outputFrame.xy;
}

vec2 unmapCoord( vec2 coord )
{
    return (coord - outputFrame.xy) * inputSize.zw;
}

vec2 pixelate(vec2 coord, vec2 size)
{
    return floor( coord / size ) * size;
}

void main(void)
{
    vec2 coord = mapCoord(vTextureCoord);
    coord = pixelate(coord, size);
    coord = unmapCoord(coord);
    // required to take backdrop from screen without extra drawcall
    coord.y = coord.y * backdropSampler_flipY.y + backdropSampler_flipY.x;

    vec4 color = texture2D(backdropSampler, coord);
    vec4 multiplier = texture2D(uSampler, vTextureCoord);

    gl_FragColor = color * multiplier.a;
}`;

class PixelateFilter extends Filter {
  constructor(size = 10) {
    super(undefined, fragment, {
      backdropSampler: Texture.WHITE.baseTexture,
      uBackdrop_flipY: new Float32Array(2),
      size: new Float32Array(2),
    });
    this.size = size;
    this.backdropUniformName = 'backdropSampler';
  }

  backdropUniformName: string;

  get size() {
    return this.uniforms.size;
  }

  set size(value) {
    if (typeof value === 'number') {
      this.uniforms.size = [value, value];
    }
    this.uniforms.size = value;
  }
}

export default PixelateFilter;

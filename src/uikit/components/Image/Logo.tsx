import React, { useState } from 'react'
import { HelpIcon } from '../Svg'
import Image from "./Image";
import { ImageProps } from './types'
 
const BAD_SRCS: { [tokenAddress: string]: true } = {}

export interface LogoProps extends ImageProps {
  srcs: string[]
}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
const Logo: React.FC<LogoProps> = ({ srcs, alt, ...rest }) => {
  const [, refresh] = useState<number>(0)

  const src: string | undefined = srcs.find((s) => !BAD_SRCS[s])
  if (src) {
    return (
      <Image
        {...rest}
        alt={alt}
        src={src}
        onError={() => {
          console.debug(`${src}`)
          if (src) BAD_SRCS[src] = true
          refresh((i) => i + 1)
        }}
      />
    )
  }

  return <HelpIcon {...rest} />
}

export default Logo

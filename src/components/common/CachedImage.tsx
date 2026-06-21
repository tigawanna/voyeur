import { useCachedImage } from '#/hooks/common/useCachedImage'
import type { ComponentProps } from 'react'

type CachedImageProps = Omit<ComponentProps<'img'>, 'src'> & {
  src: string | null
}

export function CachedImage({ src, ...props }: CachedImageProps) {
  const cachedSrc = useCachedImage(src)
  if (!cachedSrc) return null
  return <img src={cachedSrc} {...props} />
}

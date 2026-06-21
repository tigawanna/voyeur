import { imageCacheClient } from '#/lib/image-cache/image-cache-client'
import { useEffect, useState } from 'react'

export function useCachedImage(url: string | null) {
  const [src, setSrc] = useState<string | null>(url)

  useEffect(() => {
    if (!url) {
      setSrc(null)
      return
    }

    setSrc(url)
    let active = true

    void imageCacheClient.acquire(url).then((resolved) => {
      if (active) setSrc(resolved)
    })

    return () => {
      active = false
      imageCacheClient.release(url)
    }
  }, [url])

  return src
}

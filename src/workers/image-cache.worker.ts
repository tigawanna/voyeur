import type {
  ImageCacheWorkerFailure,
  ImageCacheWorkerRequest,
  ImageCacheWorkerSuccess,
} from '#/types/image-cache'

const CACHE_NAME = 'reelroom-tmdb-images-v1'
const TMDB_IMAGE_ORIGIN = 'https://image.tmdb.org/'

async function readCachedImage(url: string): Promise<{ buffer: ArrayBuffer; contentType: string }> {
  const cache = await caches.open(CACHE_NAME)
  const cached = await cache.match(url)

  if (cached) {
    const contentType = cached.headers.get('content-type') ?? 'image/jpeg'
    return { buffer: await cached.arrayBuffer(), contentType }
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Image fetch failed: ${response.status}`)
  }

  await cache.put(url, response.clone())

  const contentType = response.headers.get('content-type') ?? 'image/jpeg'
  return { buffer: await response.arrayBuffer(), contentType }
}

function postFailure(message: ImageCacheWorkerRequest, errorMessage: string) {
  const payload: ImageCacheWorkerFailure = {
    id: message.id,
    type: 'get',
    url: message.url,
    ok: false,
    message: errorMessage,
  }
  self.postMessage(payload)
}

self.onmessage = async (event: MessageEvent<ImageCacheWorkerRequest>) => {
  const message = event.data

  if (!message.url.startsWith(TMDB_IMAGE_ORIGIN)) {
    postFailure(message, 'Only TMDB image URLs are cached')
    return
  }

  try {
    const { buffer, contentType } = await readCachedImage(message.url)
    const payload: ImageCacheWorkerSuccess = {
      id: message.id,
      type: 'get',
      url: message.url,
      ok: true,
      buffer,
      contentType,
    }
    self.postMessage(payload)
  } catch (error) {
    postFailure(
      message,
      error instanceof Error ? error.message : 'Image cache failed',
    )
  }
}

export {}

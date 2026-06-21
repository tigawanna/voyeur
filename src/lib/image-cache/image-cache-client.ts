import type { ImageCacheWorkerRequest, ImageCacheWorkerResponse } from '#/types/image-cache'
import ImageCacheWorker from '#/workers/image-cache.worker?worker'

const TMDB_IMAGE_ORIGIN = 'https://image.tmdb.org/'

type CacheEntry = {
  blobUrl: string
  refs: number
  promise: Promise<string> | null
}

type PendingHandler = {
  resolve: (response: Extract<ImageCacheWorkerResponse, { ok: true }>) => void
  reject: (error: Error) => void
}

function isTmdbImageUrl(url: string) {
  return url.startsWith(TMDB_IMAGE_ORIGIN)
}

class ImageCacheClient {
  private worker: Worker | null = null
  private nextRequestId = 0
  private pending = new Map<number, PendingHandler>()
  private entries = new Map<string, CacheEntry>()

  prefetch(url: string) {
    void this.acquire(url).then(() => {
      this.release(url)
    })
  }

  acquire(url: string): Promise<string> {
    if (!isTmdbImageUrl(url)) {
      return Promise.resolve(url)
    }

    const existing = this.entries.get(url)
    if (existing) {
      existing.refs += 1
      return existing.promise ?? Promise.resolve(existing.blobUrl)
    }

    const entry: CacheEntry = {
      blobUrl: url,
      refs: 1,
      promise: null,
    }

    const promise = this.loadFromWorker(url)
      .then((blobUrl) => {
        entry.blobUrl = blobUrl
        entry.promise = null
        return blobUrl
      })
      .catch(() => {
        entry.blobUrl = url
        entry.promise = null
        return url
      })

    entry.promise = promise
    this.entries.set(url, entry)
    return promise
  }

  release(url: string) {
    const entry = this.entries.get(url)
    if (!entry) return

    entry.refs -= 1
    if (entry.refs > 0) return

    if (entry.blobUrl !== url) {
      URL.revokeObjectURL(entry.blobUrl)
    }

    this.entries.delete(url)
  }

  private getWorker() {
    if (typeof window === 'undefined') return null
    if (!this.worker) {
      this.worker = new ImageCacheWorker()
      this.worker.onmessage = (event: MessageEvent<ImageCacheWorkerResponse>) => {
        const response = event.data
        const handler = this.pending.get(response.id)
        if (!handler) return

        this.pending.delete(response.id)
        if (response.ok) {
          handler.resolve(response)
          return
        }

        handler.reject(new Error(response.message))
      }
    }

    return this.worker
  }

  private loadFromWorker(url: string): Promise<string> {
    const worker = this.getWorker()
    if (!worker) {
      return Promise.resolve(url)
    }

    return new Promise((resolve, reject) => {
      const id = ++this.nextRequestId
      this.pending.set(id, {
        resolve: (response) => {
          const blobUrl = URL.createObjectURL(
            new Blob([response.buffer], { type: response.contentType }),
          )
          resolve(blobUrl)
        },
        reject,
      })

      worker.postMessage({ id, type: 'get', url } satisfies ImageCacheWorkerRequest)
    })
  }
}

export const imageCacheClient = new ImageCacheClient()

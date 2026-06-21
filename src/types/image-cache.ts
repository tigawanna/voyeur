export type ImageCacheWorkerRequest = {
  id: number
  type: 'get'
  url: string
}

export type ImageCacheWorkerSuccess = {
  id: number
  type: 'get'
  url: string
  ok: true
  buffer: ArrayBuffer
  contentType: string
}

export type ImageCacheWorkerFailure = {
  id: number
  type: 'get'
  url: string
  ok: false
  message: string
}

export type ImageCacheWorkerResponse = ImageCacheWorkerSuccess | ImageCacheWorkerFailure

/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_PRICE_API_URL?: string
  readonly VITE_DEFAULT_CURRENCY?: string
  readonly VITE_CACHE_TTL_HOURS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

import type { PriceQuote } from './types'

const CACHE_KEY = 'zakat-prices'
const CACHE_TTL_HOURS = Number(import.meta.env.VITE_CACHE_TTL_HOURS ?? 24)

export function readPriceCache(): PriceQuote | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PriceQuote
    const ageMs = Date.now() - parsed.fetchedAt
    const ttlMs = CACHE_TTL_HOURS * 60 * 60 * 1000
    if (ageMs > ttlMs) return null
    return parsed
  } catch {
    return null
  }
}

export function writePriceCache(quote: PriceQuote) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CACHE_KEY, JSON.stringify(quote))
}

export function readStalePriceCache(): PriceQuote | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PriceQuote
  } catch {
    return null
  }
}

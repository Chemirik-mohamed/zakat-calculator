import type { CurrencyCode } from '../data/currencies'

export type NisabBasis = 'gold' | 'silver'

export type PriceSourceStatus = 'live' | 'cache' | 'manual' | 'error'

export type PriceQuote = {
  currency: CurrencyCode
  unit: 'g'
  goldPerGram: number
  silverPerGram: number
  fetchedAt: number
}

export type ManualPrices = {
  goldPerGram: number
  silverPerGram: number
}

export type ZakatResult = {
  isDue: boolean
  nisab: number
  zakat?: number
  reason?: string
}

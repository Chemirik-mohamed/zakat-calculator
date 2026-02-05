import Decimal from 'decimal.js'
import type { NisabBasis } from './types'

const NISAB_GRAMS = {
  gold: 83,
  silver: 595,
} as const

export function computeNisab(basis: NisabBasis, pricePerGram: number) {
  return new Decimal(pricePerGram).mul(NISAB_GRAMS[basis]).toNumber()
}

export function computeZakat(amount: number) {
  return new Decimal(amount).mul(0.025).toDecimalPlaces(2).toNumber()
}

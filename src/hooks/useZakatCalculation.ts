import { useMemo } from 'react'
import Decimal from 'decimal.js'
import type { NisabBasis } from '../lib/types'
import { computeNisabDecimal, computeZakat } from '../lib/zakat'

export type ZakatCalculation = {
  isDue: boolean
  nisab: number
  zakat?: number
  reason?: string
}

export function useZakatCalculation(
  amount: number,
  basis: NisabBasis,
  pricePerGram: number,
  hawlConfirmed: boolean,
): ZakatCalculation {
  return useMemo(() => {
    const nisabDecimal = computeNisabDecimal(basis, pricePerGram)
    const nisabRounded = nisabDecimal.toDecimalPlaces(2)
    const amountRounded = new Decimal(amount).toDecimalPlaces(2)
    const nisabCents = nisabRounded.mul(100).toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
    const amountCents = amountRounded.mul(100).toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
    if (!hawlConfirmed) {
      return {
        isDue: false,
        nisab: nisabRounded.toNumber(),
        reason: 'Le Hawl (année lunaire complète) n’est pas confirmé.',
      }
    }
    if (amountCents.lessThan(nisabCents)) {
      return {
        isDue: false,
        nisab: nisabRounded.toNumber(),
        reason: 'Votre épargne est en dessous du Nisâb.',
      }
    }
    return {
      isDue: true,
      nisab: nisabRounded.toNumber(),
      zakat: computeZakat(amountRounded.toNumber()),
    }
  }, [amount, basis, hawlConfirmed, pricePerGram])
}

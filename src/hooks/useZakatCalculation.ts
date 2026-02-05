import { useMemo } from 'react'
import Decimal from 'decimal.js'
import type { NisabBasis } from '../lib/types'
import { computeNisab, computeZakat } from '../lib/zakat'

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
    const nisabRounded = new Decimal(computeNisab(basis, pricePerGram)).toDecimalPlaces(2)
    const amountRounded = new Decimal(amount).toDecimalPlaces(2)
    if (!hawlConfirmed) {
      return {
        isDue: false,
        nisab: nisabRounded.toNumber(),
        reason: 'Le Hawl (année lunaire complète) n’est pas confirmé.',
      }
    }
    if (amountRounded.lessThan(nisabRounded)) {
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

import { useMemo } from 'react'
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
    const nisab = computeNisab(basis, pricePerGram)
    if (!hawlConfirmed) {
      return {
        isDue: false,
        nisab,
        reason: 'Le Hawl (année lunaire complète) n’est pas confirmé.',
      }
    }
    if (amount < nisab) {
      return {
        isDue: false,
        nisab,
        reason: 'Votre épargne est en dessous du Nisâb.',
      }
    }
    return {
      isDue: true,
      nisab,
      zakat: computeZakat(amount),
    }
  }, [amount, basis, hawlConfirmed, pricePerGram])
}

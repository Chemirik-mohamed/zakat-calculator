import { z } from 'zod'
import { CURRENCIES } from '../data/currencies'
import { normalizeAmountInput } from '../lib/format'

const currencyCodes = CURRENCIES.map((c) => c.code) as [string, ...string[]]

export const CalculationFormSchema = z.object({
  amount: z
    .string()
    .min(1, 'Veuillez indiquer un montant.')
    .refine((value) => {
      const normalized = normalizeAmountInput(value)
      return /^\d+(\.\d{1,2})?$/.test(normalized)
    }, 'Montant invalide (2 décimales max).')
    .refine((value) => {
      const normalized = normalizeAmountInput(value)
      return Number(normalized) > 0
    }, 'Le montant doit être supérieur à 0.'),
  currency: z.enum(currencyCodes),
  nisabBasis: z.enum(['gold', 'silver']),
  hijriDay: z.number().int().min(1).max(30),
  hijriMonth: z.number().int().min(1).max(12),
  hawlConfirmed: z.boolean().refine((value) => value === true, {
    message: 'Vous devez confirmer le Hawl (année lunaire complète).',
  }),
})

export type CalculationFormValues = z.infer<typeof CalculationFormSchema>

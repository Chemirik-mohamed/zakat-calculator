import { z } from 'zod'

export const PriceResponseSchema = z.object({
  timestamp: z.number(),
  currency: z.string(),
  unit: z.literal('g'),
  metals: z.object({
    gold: z.number(),
    silver: z.number(),
  }),
})

export type PriceResponse = z.infer<typeof PriceResponseSchema>

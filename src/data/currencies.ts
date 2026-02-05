export const CURRENCIES = [
  { code: 'EUR', label: 'Euro (EUR)' },
  { code: 'USD', label: 'Dollar US (USD)' },
  { code: 'GBP', label: 'Livre sterling (GBP)' },
  { code: 'CHF', label: 'Franc suisse (CHF)' },
  { code: 'CAD', label: 'Dollar canadien (CAD)' },
  { code: 'MAD', label: 'Dirham marocain (MAD)' },
] as const

export type CurrencyCode = (typeof CURRENCIES)[number]['code']

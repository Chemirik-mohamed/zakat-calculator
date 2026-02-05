import { useMemo, useState } from 'react'
import type { CurrencyCode } from '../data/currencies'
import { HIJRI_MONTHS } from '../data/hijri'
import { CalculationFormSchema } from '../schemas/calculationForm'
import { useGoldSilverPrices } from '../hooks/useGoldSilverPrices'
import { useZakatCalculation } from '../hooks/useZakatCalculation'
import { parseAmountInput } from '../lib/format'
import { CalculationForm, type CalculationFormErrors } from './CalculationForm'
import { NisabDisplay } from './NisabDisplay'
import { ResultDisplay } from './ResultDisplay'
import type { NisabBasis } from '../lib/types'

const DEFAULT_CURRENCY = (import.meta.env.VITE_DEFAULT_CURRENCY as CurrencyCode) ?? 'EUR'

export function ZakatCalculator() {
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<CurrencyCode>(DEFAULT_CURRENCY)
  const [nisabBasis, setNisabBasis] = useState<NisabBasis>('gold')
  const [hijriDay, setHijriDay] = useState(1)
  const [hijriMonth, setHijriMonth] = useState(9)
  const [hawlConfirmed, setHawlConfirmed] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const prices = useGoldSilverPrices(currency)

  const validation = CalculationFormSchema.safeParse({
    amount,
    currency,
    nisabBasis,
    hijriDay,
    hijriMonth,
    hawlConfirmed,
  })

  const errors = useMemo<CalculationFormErrors>(() => {
    if (validation.success) return {}
    return validation.error.issues.reduce<CalculationFormErrors>((acc, issue) => {
      const key = issue.path[0]
      if (typeof key === 'string' && !acc[key as keyof CalculationFormErrors]) {
        acc[key as keyof CalculationFormErrors] = issue.message
      }
      return acc
    }, {})
  }, [validation])

  const amountNumber = parseAmountInput(amount) ?? 0
  const pricePerGram = prices.data
    ? nisabBasis === 'gold'
      ? prices.data.goldPerGram
      : prices.data.silverPerGram
    : 0

  const calculation = useZakatCalculation(
    validation.success ? amountNumber : 0,
    nisabBasis,
    pricePerGram,
    hawlConfirmed,
  )

  const referenceLabel = useMemo(() => {
    const month = HIJRI_MONTHS.find((m) => m.value === hijriMonth)
    return `${hijriDay} ${month?.label ?? ''}`.trim()
  }, [hijriDay, hijriMonth])

  const ready = validation.success && pricePerGram > 0

  return (
    <section className="grid gap-6">
      <CalculationForm
        values={{ amount, currency, nisabBasis, hijriDay, hijriMonth, hawlConfirmed }}
        errors={errors}
        showErrors={submitted}
        manualMode={prices.status === 'manual'}
        manualPrices={prices.manualPrices}
        onManualPricesChange={prices.setManualPrices}
        onSubmit={() => setSubmitted(true)}
        onChange={(key, value) => {
          if (key === 'amount') setAmount(value as string)
          if (key === 'currency') setCurrency(value as CurrencyCode)
          if (key === 'nisabBasis') setNisabBasis(value as NisabBasis)
          if (key === 'hijriDay') setHijriDay(Number(value))
          if (key === 'hijriMonth') setHijriMonth(Number(value))
          if (key === 'hawlConfirmed') setHawlConfirmed(Boolean(value))
        }}
      />

      {prices.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {prices.error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <NisabDisplay
          nisab={calculation.nisab}
          currency={currency}
          basis={nisabBasis}
          pricePerGram={pricePerGram}
          status={prices.status}
        />
        <ResultDisplay
          calculation={calculation}
          currency={currency}
          amount={amountNumber}
          referenceLabel={referenceLabel}
          ready={ready}
        />
      </div>
    </section>
  )
}

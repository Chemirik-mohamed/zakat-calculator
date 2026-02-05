import { CURRENCIES, type CurrencyCode } from '../data/currencies'
import type { ManualPrices, NisabBasis } from '../lib/types'
import type { CalculationFormValues } from '../schemas/calculationForm'
import { HijriMonthSelect } from './HijriMonthSelect'
import { SelectMenu } from './SelectMenu'

export type CalculationFormState = Omit<CalculationFormValues, 'amount' | 'currency'> & {
  amount: string
  currency: CurrencyCode
}

export type CalculationFormErrors = Partial<Record<keyof CalculationFormValues, string>>

type Props = {
  values: CalculationFormState
  errors: CalculationFormErrors
  showErrors: boolean
  manualMode: boolean
  manualPrices: ManualPrices
  onSubmit: () => void
  onChange: <K extends keyof CalculationFormState>(key: K, value: CalculationFormState[K]) => void
  onManualPricesChange: (values: ManualPrices) => void
}

export function CalculationForm({
  values,
  errors,
  showErrors,
  manualMode,
  manualPrices,
  onSubmit,
  onChange,
  onManualPricesChange,
}: Props) {
  const fieldClass =
    'w-full rounded-xl border border-slate/30 bg-white px-4 py-3 text-base text-navy placeholder:text-slate-400 focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none'
  const errorClass =
    'mt-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'

  const showError = (field: keyof CalculationFormErrors) => showErrors && errors[field]

  return (
    <form
      className="rounded-2xl border border-slate/20 bg-white p-6 shadow-[0_10px_30px_rgba(11,31,42,0.08)] md:p-8"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <h3 className="mb-4 text-2xl md:text-3xl">Vos informations</h3>
      <div className="grid gap-6 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-navy">
          Montant de l’épargne
          <input
            type="text"
            value={values.amount}
            placeholder="Ex: 2500.00"
            inputMode="decimal"
            onChange={(event) => onChange('amount', event.target.value)}
            aria-invalid={Boolean(showError('amount'))}
            className={fieldClass}
          />
          {showError('amount') && <p className={errorClass}>{errors.amount}</p>}
          <p className="text-sm text-slate-500">Exemples : 11270, 11 270,00 ou 11270.50</p>
        </label>

        <label className="grid gap-2 text-sm font-medium text-navy">
          Devise
          <SelectMenu
            value={values.currency}
            options={CURRENCIES.map((currency) => ({ value: currency.code, label: currency.label }))}
            onChange={(value) => onChange('currency', value as CurrencyCode)}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-navy">
          Base du Nisâb
          <div className="mt-1 flex flex-wrap gap-4">
            {(['gold', 'silver'] as NisabBasis[]).map((basis) => (
              <label key={basis} className="flex items-center gap-2 text-sm font-medium text-navy">
                <input
                  type="radio"
                  name="nisabBasis"
                  value={basis}
                  checked={values.nisabBasis === basis}
                  onChange={() => onChange('nisabBasis', basis)}
                  className="h-4 w-4 accent-gold"
                />
                {basis === 'gold' ? 'Or (83 g)' : 'Argent (595 g)'}
              </label>
            ))}
          </div>
        </label>

        <label className="grid gap-2 text-sm font-medium text-navy">
          Date de référence Hijri (jour/mois)
          <div className="mt-1 grid gap-3 md:grid-cols-[140px_1fr]">
            <input
              type="number"
              min={1}
              max={30}
              value={values.hijriDay}
              onChange={(event) => onChange('hijriDay', Number(event.target.value))}
              className={fieldClass}
              inputMode="numeric"
            />
            <HijriMonthSelect value={values.hijriMonth} onChange={(value) => onChange('hijriMonth', value)} />
          </div>
        </label>
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm text-navy">
        <input
          type="checkbox"
          checked={values.hawlConfirmed}
          onChange={(event) => onChange('hawlConfirmed', event.target.checked)}
          className="mt-1 h-4 w-4 accent-gold"
        />
        Je confirme que mon épargne est restée au-dessus du Nisâb pendant une année lunaire complète.
      </label>
      {showError('hawlConfirmed') && <p className={errorClass}>{errors.hawlConfirmed}</p>}

      {manualMode && (
        <div className="mt-6 rounded-2xl border border-slate/20 bg-sand/50 p-4">
          <h4 className="text-base font-semibold text-navy">Prix manuels (par gramme)</h4>
          <p className="mt-1 text-sm text-slate-600">
            Aucun prix automatique disponible. Saisissez les valeurs actuelles.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-navy">
              Or (par gramme)
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={manualPrices.goldPerGram || ''}
                onChange={(event) =>
                  onManualPricesChange({
                    ...manualPrices,
                    goldPerGram: Number(event.target.value),
                  })
                }
                className={fieldClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-navy">
              Argent (par gramme)
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={manualPrices.silverPerGram || ''}
                onChange={(event) =>
                  onManualPricesChange({
                    ...manualPrices,
                    silverPerGram: Number(event.target.value),
                  })
                }
                className={fieldClass}
              />
            </label>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          className="inline-flex items-center justify-center rounded-xl bg-gold px-6 py-3 font-semibold text-navy shadow-sm transition hover:shadow-lg"
          type="submit"
        >
          Calculer la Zakât
        </button>
        <button
          className="inline-flex items-center justify-center rounded-xl border border-dashed border-slate/40 px-6 py-3 text-navy transition hover:border-slate/60"
          type="button"
          onClick={() => onChange('amount', '')}
        >
          Effacer le montant
        </button>
      </div>
    </form>
  )
}

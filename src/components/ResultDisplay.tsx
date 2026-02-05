import type { CurrencyCode } from '../data/currencies'
import type { ZakatCalculation } from '../hooks/useZakatCalculation'
import { formatCurrency } from '../lib/format'

type Props = {
  calculation: ZakatCalculation
  currency: CurrencyCode
  amount: number
  referenceLabel: string
  ready: boolean
}

export function ResultDisplay({ calculation, currency, amount, referenceLabel, ready }: Props) {
  if (!ready) {
    return (
      <div className="rounded-2xl border border-slate/20 bg-white p-6 shadow-[0_10px_30px_rgba(11,31,42,0.08)]">
        <h3 className="text-2xl md:text-3xl">Résultat</h3>
        <p className="mt-3 text-sm text-slate-500">
          Renseignez votre montant, confirmez le Hawl et assurez-vous d’avoir un prix de référence pour obtenir un calcul.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate/20 bg-white p-6 shadow-[0_10px_30px_rgba(11,31,42,0.08)]">
      <h3 className="text-2xl md:text-3xl">Résultat</h3>
      {calculation.isDue && calculation.zakat !== undefined ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
          <strong>Zakât due :</strong> {formatCurrency(calculation.zakat, currency)}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <strong>Zakât non obligatoire.</strong> {calculation.reason}
        </div>
      )}

      <p className="mt-4 text-sm text-slate-600">
        Votre épargne déclarée : <strong>{formatCurrency(amount, currency)}</strong>.
      </p>
      <p className="text-sm text-slate-600">
        Si votre épargne est restée au-dessus du Nisâb depuis <strong>{referenceLabel}</strong>,
        ce résultat correspond à votre obligation actuelle.
      </p>
    </div>
  )
}

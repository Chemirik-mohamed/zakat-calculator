import type { CurrencyCode } from '../data/currencies'
import type { NisabBasis, PriceSourceStatus } from '../lib/types'
import { formatCurrency, formatNumber } from '../lib/format'
import { PriceStatusBadge } from './PriceStatusBadge'

const BASIS_LABEL: Record<NisabBasis, string> = {
  gold: 'Or (83 g)',
  silver: 'Argent (595 g)',
}

type Props = {
  nisab: number
  currency: CurrencyCode
  basis: NisabBasis
  pricePerGram: number
  status: PriceSourceStatus
}

export function NisabDisplay({ nisab, currency, basis, pricePerGram, status }: Props) {
  return (
    <div className="rounded-2xl border border-slate/20 bg-white p-6 shadow-[0_10px_30px_rgba(11,31,42,0.08)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl md:text-3xl">Nisâb actuel</h3>
          <p className="text-sm text-slate-500">Base choisie : {BASIS_LABEL[basis]}</p>
        </div>
        <PriceStatusBadge status={status} />
      </div>
      {pricePerGram > 0 ? (
        <>
          <p className="mt-2 text-3xl font-semibold text-navy">
            {formatCurrency(nisab, currency)}
          </p>
          <p className="text-sm text-slate-500">
            Prix par gramme : {formatNumber(pricePerGram)} {currency}
          </p>
        </>
      ) : (
        <p className="text-sm text-slate-500">Veuillez indiquer un prix pour calculer le Nisâb.</p>
      )}
    </div>
  )
}

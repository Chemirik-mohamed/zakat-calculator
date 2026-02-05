import type { PriceSourceStatus } from '../lib/types'

const STATUS_COPY: Record<PriceSourceStatus, { label: string; className: string }> = {
  live: { label: 'Prix en direct', className: 'bg-emerald-100 text-emerald-700' },
  cache: { label: 'Prix depuis le cache', className: 'bg-slate-100 text-slate-600' },
  manual: { label: 'Saisie manuelle', className: 'bg-slate-100 text-slate-600' },
  error: { label: 'Prix indisponibles', className: 'bg-red-100 text-red-700' },
}

export function PriceStatusBadge({ status }: { status: PriceSourceStatus }) {
  const { label, className } = STATUS_COPY[status]
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {label}
    </span>
  )
}

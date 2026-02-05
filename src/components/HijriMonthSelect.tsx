import { useEffect, useMemo, useRef, useState } from 'react'
import { HIJRI_MONTHS } from '../data/hijri'

type Props = {
  value: number
  onChange: (value: number) => void
}

export function HijriMonthSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentLabel = useMemo(() => {
    return HIJRI_MONTHS.find((month) => month.value === value)?.label ?? 'Mois'
  }, [value])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKey)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-xl border border-slate/30 bg-white px-4 py-3 text-left text-base text-navy shadow-sm transition focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{currentLabel}</span>
        <span className="text-slate-500">
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1 1L8 8L15 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 z-20 mt-2 max-h-64 overflow-auto rounded-2xl border border-slate/20 bg-white p-2 shadow-xl"
          role="listbox"
        >
          {HIJRI_MONTHS.map((month) => (
            <button
              key={month.value}
              type="button"
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-sand/70 ${
                month.value === value ? 'bg-sand text-navy' : 'text-slate-700'
              }`}
              onClick={() => {
                onChange(month.value)
                setOpen(false)
              }}
              role="option"
              aria-selected={month.value === value}
            >
              <span>{month.label}</span>
              {month.value === value && <span className="text-gold">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

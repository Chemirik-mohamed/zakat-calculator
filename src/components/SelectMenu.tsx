import { useEffect, useRef, useState } from 'react'

type Option = {
  value: string
  label: string
}

type Props = {
  value: string
  options: Option[]
  onChange: (value: string) => void
}

export function SelectMenu({ value, options, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

  const current = options.find((option) => option.value === value)

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-xl border border-slate/30 bg-white px-4 py-3 text-left text-base text-navy shadow-sm transition focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{current?.label ?? 'Sélectionner'}</span>
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
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-sand/70 ${
                option.value === value ? 'bg-sand text-navy' : 'text-slate-700'
              }`}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              role="option"
              aria-selected={option.value === value}
            >
              <span>{option.label}</span>
              {option.value === value && <span className="text-gold">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

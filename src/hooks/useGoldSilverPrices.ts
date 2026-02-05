import { useEffect, useMemo, useState } from 'react'
import type { CurrencyCode } from '../data/currencies'
import type { ManualPrices, PriceQuote, PriceSourceStatus } from '../lib/types'
import { readPriceCache, readStalePriceCache, writePriceCache } from '../lib/cache'
import { PriceResponseSchema } from '../schemas/prices'

const DEFAULT_MANUAL: ManualPrices = { goldPerGram: 0, silverPerGram: 0 }
const TROY_OUNCE_IN_GRAMS = 31.1034768
const GOLD_JSON_URL = 'https://freegoldapi.com/data/latest.json'
const GOLD_SILVER_RATIO_URL = 'https://freegoldapi.com/data/gold_silver_ratio_enriched.csv'
const FX_USD_URL = 'https://open.er-api.com/v6/latest/USD'

export type UsePricesState = {
  data: PriceQuote | null
  status: PriceSourceStatus
  error?: string
  manualPrices: ManualPrices
  setManualPrices: (values: ManualPrices) => void
}

function getApiUrl(currency: CurrencyCode) {
  const baseUrl = import.meta.env.VITE_PRICE_API_URL as string | undefined
  if (!baseUrl) return null
  const url = new URL(baseUrl)
  url.searchParams.set('currency', currency)
  url.searchParams.set('unit', 'g')
  return url.toString()
}

function parseRatioFromCsv(csv: string) {
  const lines = csv
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    throw new Error('Aucune donnée CSV disponible.')
  }

  const header = lines[0]
  const commaCount = header.split(',').length
  const semicolonCount = header.split(';').length
  const separator = semicolonCount > commaCount ? ';' : ','
  const headerCells = header
    .toLowerCase()
    .split(separator)
    .map((cell) => cell.trim())

  const ratioIndex = headerCells.findIndex(
    (cell) => cell.includes('silver_oz_per_gold_oz') || cell.includes('ratio'),
  )

  for (let index = lines.length - 1; index > 0; index -= 1) {
    const cells = lines[index].split(separator).map((cell) => cell.trim())
    const candidate = ratioIndex >= 0 ? cells[ratioIndex] : cells[cells.length - 1]
    const value = Number(candidate)
    if (Number.isFinite(value) && value > 0) {
      return value
    }
  }

  throw new Error('Ratio or/argent invalide.')
}

async function fetchNoKeyQuote(currency: CurrencyCode): Promise<PriceQuote> {
  const [goldResponse, ratioResponse] = await Promise.all([
    fetch(GOLD_JSON_URL),
    fetch(GOLD_SILVER_RATIO_URL),
  ])

  if (!goldResponse.ok) {
    throw new Error('Impossible de charger les prix de l’or.')
  }
  if (!ratioResponse.ok) {
    throw new Error('Impossible de charger le ratio or/argent.')
  }

  const goldJson = (await goldResponse.json()) as Array<{ date: string; price: number }>
  if (!Array.isArray(goldJson) || goldJson.length === 0) {
    throw new Error('Réponse invalide pour le prix de l’or.')
  }
  const latestGold = goldJson[goldJson.length - 1]
  const goldUsdPerOz = Number(latestGold.price)
  if (!Number.isFinite(goldUsdPerOz)) {
    throw new Error('Prix de l’or invalide.')
  }

  const ratioCsv = await ratioResponse.text()
  const ratio = parseRatioFromCsv(ratioCsv)
  if (!Number.isFinite(ratio) || ratio <= 0) {
    throw new Error('Ratio or/argent invalide.')
  }

  const silverUsdPerOz = goldUsdPerOz / ratio

  let fxRate = 1
  if (currency !== 'USD') {
    const fxResponse = await fetch(FX_USD_URL)
    if (!fxResponse.ok) {
      throw new Error('Impossible de charger les taux de change.')
    }
    const fxJson = (await fxResponse.json()) as { rates?: Record<string, number> }
    const rate = fxJson?.rates?.[currency]
    if (typeof rate !== 'number' || !Number.isFinite(rate)) {
      throw new Error('Devise non supportée par le service de change.')
    }
    fxRate = rate
  }

  return {
    currency,
    unit: 'g',
    goldPerGram: (goldUsdPerOz / TROY_OUNCE_IN_GRAMS) * fxRate,
    silverPerGram: (silverUsdPerOz / TROY_OUNCE_IN_GRAMS) * fxRate,
    fetchedAt: Date.now(),
  }
}

async function fetchCustomQuote(currency: CurrencyCode, url: string): Promise<PriceQuote> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('API personnalisée indisponible.')
  }
  const raw = await response.json()
  const parsed = PriceResponseSchema.parse(raw)
  return {
    currency,
    unit: 'g',
    goldPerGram: parsed.metals.gold,
    silverPerGram: parsed.metals.silver,
    fetchedAt: parsed.timestamp * 1000,
  }
}

export function useGoldSilverPrices(currency: CurrencyCode): UsePricesState {
  const [data, setData] = useState<PriceQuote | null>(null)
  const [status, setStatus] = useState<PriceSourceStatus>('cache')
  const [error, setError] = useState<string | undefined>()
  const [manualPrices, setManualPrices] = useState<ManualPrices>(DEFAULT_MANUAL)

  useEffect(() => {
    const cached = readPriceCache()
    if (cached && cached.currency === currency) {
      setData(cached)
      setStatus('cache')
    }
  }, [currency])

  useEffect(() => {
    let isMounted = true
    setStatus('cache')
    const url = getApiUrl(currency)
    const fetcher = url ? fetchCustomQuote(currency, url) : fetchNoKeyQuote(currency)

    fetcher
      .then((quote) => {
        if (!isMounted) return
        writePriceCache(quote)
        setData(quote)
        setStatus('live')
        setError(undefined)
      })
      .catch((err: Error) => {
        const stale = readStalePriceCache()
        if (!isMounted) return
        if (stale) {
          setData(stale)
          setStatus('cache')
          setError(err.message || 'Impossible de joindre la source automatique.')
        } else {
          setStatus('manual')
          setError(err.message || 'Sources automatiques indisponibles.')
        }
      })

    return () => {
      isMounted = false
    }
  }, [currency])

  const mergedData = useMemo(() => {
    if (status === 'manual') {
      return {
        currency,
        unit: 'g',
        goldPerGram: manualPrices.goldPerGram,
        silverPerGram: manualPrices.silverPerGram,
        fetchedAt: Date.now(),
      } satisfies PriceQuote
    }
    return data
  }, [currency, data, manualPrices, status])

  return {
    data: mergedData,
    status,
    error,
    manualPrices,
    setManualPrices,
  }
}

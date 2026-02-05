import { ZakatCalculator } from './components/ZakatCalculator'
import { FAQSection } from './components/FAQSection'

function App() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto w-[min(1120px,92vw)] py-12">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Plateforme de Zakât</p>
        <h1 className="mt-2 text-3xl md:text-5xl">Calculez votre Zakât en toute clarté</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
          Cet outil vous aide à estimer votre Zakât sur l’épargne selon le Nisâb. Il est gratuit,
          transparent et conçu pour une utilisation simple sur mobile.
        </p>
      </header>

      <main className="mx-auto w-[min(1120px,92vw)] pb-12">
        <ZakatCalculator />
        <FAQSection />
      </main>

      <footer className="mx-auto w-[min(1120px,92vw)] pb-8">
        <p className="text-sm text-slate-500">
          Rappel : la Zakât est une obligation spirituelle. Cet outil reste informatif et ne remplace
          pas une consultation auprès d’un savant.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Taux de change :{' '}
          <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer">
            Rates By Exchange Rate API
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App

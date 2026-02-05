import { FAQ_ITEMS } from '../data/faq'
import { RELIGIOUS_SOURCES } from '../data/sources'

export function FAQSection() {
  return (
    <section className="mt-8 rounded-2xl border border-slate/20 bg-white p-6 shadow-[0_10px_30px_rgba(11,31,42,0.08)] md:p-8">
      <h2 className="text-2xl md:text-3xl">FAQ & Sources</h2>
      <div className="mt-4 grid gap-3">
        {FAQ_ITEMS.map((item) => (
          <details key={item.question} className="border-b border-slate/20 py-2">
            <summary className="cursor-pointer text-sm font-semibold text-navy">{item.question}</summary>
            <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
          </details>
        ))}
      </div>

      <details className="mt-6">
        <summary className="cursor-pointer text-sm font-semibold text-navy">
          Sources (références)
        </summary>
        <ul className="mt-3 space-y-4 pl-4 text-sm text-slate-600">
          {RELIGIOUS_SOURCES.map((source) => (
            <li key={source.title}>
              <strong className="text-navy">{source.title} :</strong> {source.text}
              <div className="mt-2 grid gap-1">
                {source.links.map((link) => (
                  <a key={link} href={link} target="_blank" rel="noreferrer">
                    {link}
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </details>

      <p className="mt-4 text-sm text-slate-500">
        Cet outil est informatif. Consultez un savant ou un organisme reconnu pour des cas particuliers.
      </p>
    </section>
  )
}

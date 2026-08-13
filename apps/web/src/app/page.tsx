const runtimeItems = [
  ['API', 'Versionierter Vertrag und Health'],
  ['Worker', 'Readiness und kontrollierter Drain'],
  ['Daten', 'Ausschließlich synthetische lokale Daten'],
] as const;

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 py-10 sm:px-10 sm:py-14">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <p className="text-sm font-semibold tracking-tight">Voice AI Agent</p>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
              Lokale Foundation
            </span>
            <a
              className="rounded-full border border-sky-300/30 px-3 py-1 text-xs font-medium text-sky-200 hover:bg-sky-300/10"
              href="/auth/login"
            >
              Sicher anmelden
            </a>
          </div>
        </header>

        <section aria-labelledby="foundation-title" className="max-w-3xl py-16 sm:py-24">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.22em] text-sky-300">
            Providerfreier Runtime-Vertrag
          </p>
          <h1
            id="foundation-title"
            className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl"
          >
            Die technische Basis ist bereit für den nächsten sicheren Schritt.
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-base leading-8 text-slate-300 sm:text-lg">
            API, Web und Worker bleiben vollständig im synthetischen Fake-/Replay-Modus. Reale
            Nachrichten, Telefonie, Zahlungen und Voice sind weiterhin deaktiviert.
          </p>
        </section>

        <section aria-labelledby="runtime-title" className="pb-8">
          <h2 id="runtime-title" className="sr-only">
            Runtime-Bausteine
          </h2>
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
            {runtimeItems.map(([title, description]) => (
              <li key={title} className="bg-slate-950 px-6 py-6">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

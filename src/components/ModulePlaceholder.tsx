interface ModulePlaceholderProps {
  icon: string;
  title: string;
  description: string;
  roadmap: string[];
}

// Page d'attente affichée pour les modules pas encore développés.
export function ModulePlaceholder({
  icon,
  title,
  description,
  roadmap,
}: ModulePlaceholderProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-4 text-4xl">{icon}</div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        <p className="mt-2 text-slate-500">{description}</p>

        <div className="mt-6 rounded-xl bg-slate-50 p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Au programme
          </h2>
          <ul className="space-y-2">
            {roadmap.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-slate-600"
              >
                <span className="mt-0.5 text-brand-500">▹</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

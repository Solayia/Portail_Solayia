import Link from "next/link";
import type { PortalModule } from "@/lib/modules";

export function ModuleCard({ module }: { module: PortalModule }) {
  const isLive = module.status === "live";

  return (
    <Link
      href={module.href}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-3xl">{module.icon}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            isLive
              ? "bg-green-100 text-green-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {isLive ? "Actif" : "Bientôt"}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-brand-700">
        {module.label}
      </h3>
      <p className="mt-1 text-sm text-slate-500">{module.description}</p>
    </Link>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MODULES } from "@/lib/modules";

const baseLink =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="px-5 py-5">
        <Link href="/dashboard" className="text-xl font-bold text-brand-700">
          Solayia
        </Link>
        <p className="text-xs text-slate-400">Portail interne</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        <Link
          href="/dashboard"
          className={`${baseLink} ${
            pathname === "/dashboard"
              ? "bg-brand-50 text-brand-700"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <span>🏠</span>
          Accueil
        </Link>

        <div className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Modules
        </div>

        {MODULES.map((mod) => {
          const active = pathname.startsWith(mod.href);
          return (
            <Link
              key={mod.key}
              href={mod.href}
              className={`${baseLink} ${
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{mod.icon}</span>
              <span className="flex-1">{mod.label}</span>
              {mod.status === "soon" && (
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                  bientôt
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

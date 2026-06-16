"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { authenticate } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-brand-600 px-4 py-2.5 font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
    >
      {pending ? "Connexion…" : "Se connecter"}
    </button>
  );
}

export default function LoginPage() {
  const [errorMessage, formAction] = useActionState(authenticate, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-slate-100 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <div className="mb-6 text-center">
          <div className="text-2xl font-bold tracking-tight text-brand-700">
            Solayia
          </div>
          <p className="mt-1 text-sm text-slate-500">Portail interne</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="vous@solayia.fr"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
          </div>

          {errorMessage && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          <SubmitButton />
        </form>
      </div>
    </main>
  );
}

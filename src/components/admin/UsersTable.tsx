"use client";

import { useState, useTransition } from "react";
import { Role } from "@prisma/client";
import {
  deleteUser,
  resetPassword,
  setUserActive,
  updateUserRole,
  type ActionResult,
} from "@/app/(app)/admin/users/actions";

interface UserRow {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrateur",
  MANAGER: "Manager",
  AGENT: "Agent",
};

export function UsersTable({
  users,
  currentUserId,
}: {
  users: UserRow[];
  currentUserId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<ActionResult | null>(null);

  function run(action: () => Promise<ActionResult>) {
    startTransition(async () => {
      const result = await action();
      setFeedback(result);
    });
  }

  return (
    <div>
      {feedback?.error && (
        <p className="mx-6 mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {feedback.error}
        </p>
      )}
      {feedback?.success && (
        <p className="mx-6 mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          {feedback.success}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-6 py-3 font-semibold">Utilisateur</th>
              <th className="px-6 py-3 font-semibold">Rôle</th>
              <th className="px-6 py-3 font-semibold">Statut</th>
              <th className="px-6 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              return (
                <tr key={user.id} className={isPending ? "opacity-60" : ""}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">
                      {user.name ?? "—"}
                      {isSelf && (
                        <span className="ml-2 text-xs text-slate-400">(vous)</span>
                      )}
                    </div>
                    <div className="text-slate-500">{user.email}</div>
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      disabled={isPending}
                      onChange={(e) =>
                        run(() => updateUserRole(user.id, e.target.value as Role))
                      }
                      className="rounded-lg border border-slate-300 px-2 py-1.5 outline-none focus:border-brand-500"
                    >
                      {Object.values(Role).map((role) => (
                        <option key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        user.active
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {user.active ? "Actif" : "Désactivé"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          run(() => setUserActive(user.id, !user.active))
                        }
                        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                      >
                        {user.active ? "Désactiver" : "Activer"}
                      </button>

                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => {
                          const pwd = window.prompt(
                            `Nouveau mot de passe pour ${user.email} (8 caractères min.) :`,
                          );
                          if (pwd) run(() => resetPassword(user.id, pwd));
                        }}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                      >
                        Réinitialiser MDP
                      </button>

                      <button
                        type="button"
                        disabled={isPending || isSelf}
                        onClick={() => {
                          if (
                            window.confirm(
                              `Supprimer définitivement ${user.email} ?`,
                            )
                          ) {
                            run(() => deleteUser(user.id));
                          }
                        }}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

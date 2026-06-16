import { doSignOut } from "@/app/(app)/actions";

export function SignOutButton() {
  return (
    <form action={doSignOut}>
      <button
        type="submit"
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
      >
        Déconnexion
      </button>
    </form>
  );
}

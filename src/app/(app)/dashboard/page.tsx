import { auth } from "@/auth";
import { ModuleCard } from "@/components/ModuleCard";
import { MODULES } from "@/lib/modules";

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Bonjour{firstName ? ` ${firstName}` : ""} 👋
        </h1>
        <p className="mt-1 text-slate-500">
          Bienvenue sur le portail interne Solayia. Choisissez un module pour
          commencer.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((module) => (
          <ModuleCard key={module.key} module={module} />
        ))}
      </div>
    </div>
  );
}

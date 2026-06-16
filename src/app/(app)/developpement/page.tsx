import { ModulePlaceholder } from "@/components/ModulePlaceholder";

export default function DeveloppementPage() {
  return (
    <ModulePlaceholder
      icon="🛠️"
      title="Développement"
      description="Espace technique pour piloter les projets de développement et centraliser les outils internes."
      roadmap={[
        "Suivi des projets et tâches techniques",
        "Documentation interne",
        "Accès aux environnements et outils",
      ]}
    />
  );
}

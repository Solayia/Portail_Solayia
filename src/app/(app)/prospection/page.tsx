import { ModulePlaceholder } from "@/components/ModulePlaceholder";

export default function ProspectionPage() {
  return (
    <ModulePlaceholder
      icon="🎯"
      title="Prospection"
      description="Le cœur métier du mandataire : trouver, qualifier et suivre les prospects jusqu'à la signature."
      roadmap={[
        "Base de prospects et fiches clients",
        "Pipeline commercial (étapes, relances, rappels)",
        "Enrichissement automatique via le connecteur données entreprises",
        "Tableau de bord d'activité commerciale",
      ]}
    />
  );
}

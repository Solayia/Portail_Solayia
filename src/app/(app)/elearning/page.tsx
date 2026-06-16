import { ModulePlaceholder } from "@/components/ModulePlaceholder";

export default function ElearningPage() {
  return (
    <ModulePlaceholder
      icon="🎓"
      title="E-learning"
      description="Socle de formation pour monter les équipes en compétence et suivre leur progression."
      roadmap={[
        "Catalogue de cours et parcours",
        "Lecteur de modules (vidéo, texte, quiz)",
        "Suivi de progression et certifications",
      ]}
    />
  );
}

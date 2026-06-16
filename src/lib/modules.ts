import type { Role } from "@prisma/client";

export type ModuleStatus = "live" | "soon";

export interface PortalModule {
  key: string;
  label: string;
  href: string;
  description: string;
  /** Emoji d'illustration, à remplacer par une vraie icône plus tard. */
  icon: string;
  status: ModuleStatus;
  /** Rôles autorisés à voir le module. `undefined` = tout le monde. */
  roles?: Role[];
}

// Source de vérité unique : la sidebar ET les cartes du dashboard s'appuient dessus.
export const MODULES: PortalModule[] = [
  {
    key: "prospection",
    label: "Prospection",
    href: "/prospection",
    description:
      "Gestion des prospects et clients, suivi des relances et pipeline commercial.",
    icon: "🎯",
    status: "soon",
  },
  {
    key: "developpement",
    label: "Développement",
    href: "/developpement",
    description:
      "Espace technique : suivi des projets de dev et outils internes.",
    icon: "🛠️",
    status: "soon",
  },
  {
    key: "elearning",
    label: "E-learning",
    href: "/elearning",
    description:
      "Formations, modules de cours et suivi de progression des équipes.",
    icon: "🎓",
    status: "soon",
  },
];

export function getModule(key: string): PortalModule | undefined {
  return MODULES.find((m) => m.key === key);
}

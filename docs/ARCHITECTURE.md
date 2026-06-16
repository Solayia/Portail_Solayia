# Architecture & feuille de route

Ce document décrit la vision d'ensemble du Portail Solayia et la façon dont les
modules s'articulent autour du socle commun.

## Principe : un socle, des modules

Le portail est pensé comme une **plateforme modulaire**. Le socle fournit ce qui
est commun à tout le monde ; chaque module métier vient se brancher dessus sans
réécrire l'authentification, la navigation ou la couche d'accès aux données.

```
┌─────────────────────────────────────────────┐
│                  SOCLE COMMUN                │
│  Auth · Utilisateurs/Rôles · Navigation · DB │
└─────────────────────────────────────────────┘
        │              │               │
   ┌────▼────┐   ┌─────▼─────┐   ┌─────▼──────┐
   │Prospect.│   │   Dev     │   │ E-learning │
   └─────────┘   └───────────┘   └────────────┘
```

### Ce que fournit le socle (livré)

- **Authentification** par email/mot de passe (Auth.js v5, sessions JWT).
- **Gestion des utilisateurs et rôles** (`ADMIN`, `MANAGER`, `AGENT`) via Prisma.
- **Protection des routes** par middleware (tout est privé sauf `/login`).
- **Navigation** : sidebar + dashboard alimentés par une source unique
  (`src/lib/modules.ts`).

### Conventions pour ajouter un module

1. Créer le dossier de routes sous `src/app/(app)/<module>/`.
2. Ajouter ses modèles Prisma dans `prisma/schema.prisma` (préfixer les tables
   pour rester lisible, ex. `prospect_*`).
3. Déclarer le module dans `src/lib/modules.ts` et passer son `status` à `"live"`.
4. Restreindre l'accès si besoin via le champ `roles` du module.

## Feuille de route

### Étape 1 — Socle ✅ (en cours de livraison)

Auth, rôles, dashboard, navigation, pages d'attente des modules.

### Étape 2 — Prospection (CRM) 🔜

Le cœur métier d'un mandataire. Pistes envisagées :

- Modèle `Prospect` / `Client` avec statut, source, propriétaire.
- Pipeline commercial (étapes personnalisables, relances, rappels).
- **Enrichissement automatique** : l'environnement dispose déjà d'un connecteur
  de données entreprises (recherche, matching, enrichissement de prospects,
  événements business). À intégrer pour pré-remplir les fiches et qualifier
  automatiquement.
- Tableau de bord d'activité commerciale.

### Étape 3 — E-learning 🔜

- Catalogue de cours / parcours.
- Lecteur de modules (vidéo, texte, quiz).
- Suivi de progression et certifications.

### Étape 4 — Développement 🔜

- Suivi des projets et tâches techniques.
- Documentation interne centralisée.

## Décisions techniques à trancher plus tard

- **Multi-tenant ?** Un seul espace Solayia pour l'instant ; à revoir si la
  plateforme doit servir plusieurs entités.
- **Stockage de fichiers** (supports e-learning) : S3 / stockage objet à choisir.
- **Notifications** (relances prospection) : email transactionnel à brancher.

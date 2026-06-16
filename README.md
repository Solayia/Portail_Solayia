# Portail Solayia

Portail interne de **Solayia** (mandataire digital). Une plateforme modulaire qui
regroupera plusieurs outils métier autour d'un socle commun (authentification,
navigation, gestion des utilisateurs).

## Modules

| Module          | État    | Description                                                       |
| --------------- | ------- | ----------------------------------------------------------------- |
| 🏠 Accueil       | ✅ Livré | Dashboard d'entrée + navigation entre modules                     |
| ⚙️ Administration | ✅ Livré | Gestion des utilisateurs : ajout, suppression, rôles, activation  |
| 🎯 Prospection   | 🔜 À venir | CRM léger : prospects, pipeline, relances, enrichissement données |
| 🛠️ Développement | 🔜 À venir | Suivi des projets de dev et outils internes                       |
| 🎓 E-learning    | 🔜 À venir | Cours, modules et suivi de progression                            |

## Stack technique

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** pour le style
- **Prisma** + **PostgreSQL** pour les données
- **Auth.js (NextAuth v5)** pour l'authentification (identifiants email/mot de passe)

## Démarrage en local

### 1. Prérequis

- Node.js 20+ (ce projet est testé avec Node 22)
- Une base PostgreSQL. Le plus simple en local avec Docker :

```bash
docker run --name solayia-db \
  -e POSTGRES_PASSWORD=solayia -e POSTGRES_DB=solayia \
  -p 5432:5432 -d postgres:16
```

### 2. Installation

```bash
npm install
cp .env.example .env        # puis ajuste les valeurs si besoin
```

Génère une clé pour `AUTH_SECRET` :

```bash
openssl rand -base64 32
```

### 3. Base de données

```bash
npm run db:migrate  # applique les migrations Prisma (crée les tables)
npm run db:seed     # crée l'utilisateur admin par défaut
```

### 4. Lancer l'application

```bash
npm run dev
```

Ouvre http://localhost:3000 et connecte-toi avec :

- **Email** : `admin@solayia.fr`
- **Mot de passe** : `Solayia2026!` _(à changer rapidement)_

## Scripts utiles

| Commande             | Rôle                                          |
| -------------------- | --------------------------------------------- |
| `npm run dev`        | Serveur de développement                      |
| `npm run build`      | Build de production                           |
| `npm run db:studio`  | Interface visuelle Prisma Studio              |
| `npm run db:migrate` | Crée une migration versionnée                 |

## Structure du projet

```
src/
├── app/
│   ├── (app)/              # zone connectée (layout avec sidebar)
│   │   ├── dashboard/      # accueil
│   │   ├── prospection/    # module Prospection
│   │   ├── developpement/  # module Développement
│   │   └── elearning/      # module E-learning
│   ├── api/auth/           # routes Auth.js
│   └── login/              # page de connexion
├── components/             # composants UI partagés
├── lib/
│   ├── modules.ts          # source de vérité des modules (sidebar + dashboard)
│   └── prisma.ts           # client Prisma
├── auth.config.ts          # config Auth.js edge-safe (utilisée par le middleware)
├── auth.ts                 # config Auth.js complète (Prisma + bcrypt)
└── middleware.ts           # protège toutes les routes sauf /login
```

## Espace d'administration

Réservé aux comptes **ADMIN** (lien « Administration » dans la barre latérale, ou
`/admin/users`). Il permet de :

- créer un utilisateur (nom, email, mot de passe provisoire, rôle) ;
- changer le rôle (`ADMIN` / `MANAGER` / `AGENT`) ;
- activer / désactiver un compte (un compte désactivé ne peut plus se connecter) ;
- réinitialiser un mot de passe ;
- supprimer un utilisateur.

Garde-fous : impossible de supprimer/désactiver son propre compte ni le dernier
administrateur de la plateforme.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — vision modulaire et feuille de route.
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — mise en production (Vercel ou Docker).

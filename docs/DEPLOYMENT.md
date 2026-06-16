# Mise en production — Portail Solayia

Ce guide couvre le déploiement du socle. Deux chemins au choix : **Vercel**
(le plus simple pour Next.js) ou **Docker** (n'importe quel serveur / VPS).

## Variables d'environnement requises

| Variable          | Rôle                                                       |
| ----------------- | ---------------------------------------------------------- |
| `DATABASE_URL`    | Connexion PostgreSQL (avec SSL en prod).                   |
| `AUTH_SECRET`     | Clé de signature des sessions. **Obligatoire en prod.**    |
| `AUTH_TRUST_HOST` | `true` (nécessaire hors Vercel pour qu'Auth.js fasse confiance à l'hôte). |

Générer un secret :

```bash
openssl rand -base64 32
```

## Avant la première mise en ligne

1. **Base de données managée** : crée une instance PostgreSQL (Neon, Supabase,
   Railway, RDS, Scaleway…). Récupère son `DATABASE_URL` (souvent avec
   `?sslmode=require`).
2. **Appliquer les migrations** :
   ```bash
   DATABASE_URL="<prod>" npm run db:deploy
   ```
3. **Créer le premier admin** :
   ```bash
   DATABASE_URL="<prod>" npm run db:seed
   ```
   Puis **change immédiatement** le mot de passe par défaut depuis l'interface.

> Les migrations sont versionnées dans `prisma/migrations/`. En prod on utilise
> toujours `prisma migrate deploy` (jamais `db push` ni `migrate dev`).

---

## Option A — Vercel (recommandé)

1. Pousser le dépôt sur GitHub (déjà fait).
2. Sur [vercel.com](https://vercel.com) : **New Project** → importer le repo.
3. Renseigner les variables d'environnement (`DATABASE_URL`, `AUTH_SECRET`).
   `AUTH_TRUST_HOST` n'est pas nécessaire sur Vercel.
4. Déployer. Vercel détecte Next.js automatiquement.
5. Lancer une fois les migrations + le seed (étapes ci-dessus) en pointant sur la
   base de prod, depuis ta machine ou un job.

> Astuce : on peut automatiser les migrations au build en ajoutant
> `prisma migrate deploy && next build` comme *Build Command*.

## Option B — Docker (VPS / serveur)

Tout est prêt (`Dockerfile`, `docker-compose.yml`, build `standalone`).

**Pile complète en local (app + Postgres)** :

```bash
AUTH_SECRET="$(openssl rand -base64 32)" docker compose up --build
```

L'app applique les migrations au démarrage (`migrate deploy`) puis sert sur le
port 3000. Reste à créer l'admin une fois :

```bash
docker compose exec app node_modules/.bin/tsx prisma/seed.ts
```

**Image seule** (base externe) :

```bash
docker build -t portail-solayia .
docker run -p 3000:3000 \
  -e DATABASE_URL="<prod>" \
  -e AUTH_SECRET="<secret>" \
  -e AUTH_TRUST_HOST=true \
  portail-solayia
```

---

## Checklist prod

- [ ] `AUTH_SECRET` défini (valeur aléatoire, jamais commitée)
- [ ] `DATABASE_URL` pointe sur la base managée (SSL activé)
- [ ] Migrations appliquées (`npm run db:deploy`)
- [ ] Premier admin créé puis **mot de passe par défaut changé**
- [ ] HTTPS actif (fourni par Vercel ; via reverse-proxy en Docker)
- [ ] Sauvegardes de la base configurées

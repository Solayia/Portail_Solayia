# Mise en production — Portail Solayia

Hébergement retenu : **Clever Cloud** 🇫🇷 (français, RGPD-friendly, données en
Europe), en déploiement **Docker** (le `Dockerfile` du projet applique les
migrations puis démarre l'app).

> On peut **démarrer gratuitement** : Clever Cloud offre des crédits d'essai sans
> carte bancaire, et propose un plan PostgreSQL **DEV** gratuit (petit, idéal pour
> valider). Pour la vraie prod (≈ 50 utilisateurs, milliers de fiches), on passera
> sur une petite base payante (quelques €/mois).

## Variables d'environnement

| Variable                      | Valeur                                                        |
| ----------------------------- | ------------------------------------------------------------ |
| `DATABASE_URL`                | Fournie automatiquement par l'add-on PostgreSQL (voir étape 3). |
| `AUTH_SECRET`                 | Clé de signature des sessions (générée ci-dessous).          |
| `AUTH_TRUST_HOST`             | `true`                                                       |
| `CC_DOCKER_EXPOSED_HTTP_PORT` | `3000` (indique à Clever sur quel port l'app écoute).        |

Générer le secret :

```bash
openssl rand -base64 32
```

---

## Déploiement Clever Cloud (pas à pas)

### 1. Compte & CLI

- Crée un compte sur [console.clever-cloud.com](https://console.clever-cloud.com)
  (crédits d'essai offerts, sans CB).
- (Optionnel mais pratique) installe la CLI :
  ```bash
  npm i -g clever-tools
  clever login
  ```

### 2. Créer l'application Docker

Depuis la console : **Create › an application › from a Git repository** (ou GitHub),
puis choisis le type **Docker**. Sélectionne une **région EU** (Paris).

Via la CLI, dans le dossier du projet :

```bash
clever create --type docker "portail-solayia" --region par
clever scale --flavor nano        # petite instance pour démarrer
```

### 3. Ajouter la base PostgreSQL

Console : **Create › an add-on › PostgreSQL**, plan **DEV** (gratuit) pour
commencer, région **Paris**, puis **relie-le à l'application**.

Via la CLI :

```bash
clever addon create postgresql-addon "solayia-db" --plan dev --region par
clever service link-addon "solayia-db"
```

> Lier l'add-on injecte automatiquement `POSTGRESQL_ADDON_URI` dans l'app.

### 4. Configurer les variables d'environnement

Console : onglet **Environment variables** de l'app. Via la CLI :

```bash
clever env set AUTH_SECRET "COLLE_TON_SECRET_ICI"
clever env set AUTH_TRUST_HOST "true"
clever env set CC_DOCKER_EXPOSED_HTTP_PORT "3000"
# Mappe l'URL de l'add-on vers la variable attendue par Prisma :
clever env set DATABASE_URL "\$POSTGRESQL_ADDON_URI"
```

> Si `$POSTGRESQL_ADDON_URI` n'inclut pas `?sslmode=require`, ajoute-le.

### 5. Déployer

```bash
git push clever main      # la CLI a ajouté le remote « clever »
# ou : clever deploy
```

Au démarrage, le conteneur exécute `prisma migrate deploy` (création des tables)
puis lance le serveur.

### 6. Créer le premier administrateur

Une seule fois, **depuis ta machine** en pointant sur la base de prod (récupère
l'URL via `clever env | grep POSTGRESQL_ADDON_URI` ou la console) :

```bash
DATABASE_URL="<url-postgres-prod>" npm run db:seed   # crée admin@solayia.fr
```

> On seed depuis le poste local car l'image de prod est minimale (pas d'outil
> `tsx`). C'est ponctuel : ensuite tout se gère depuis `/admin/users`.

Connecte-toi puis **change immédiatement le mot de passe par défaut** via
`/admin/users`.

---

## Checklist prod

- [ ] App Docker créée en région **EU (Paris)**
- [ ] Add-on PostgreSQL lié, `DATABASE_URL` → `$POSTGRESQL_ADDON_URI` (SSL activé)
- [ ] `AUTH_SECRET` défini (aléatoire, jamais commité)
- [ ] `AUTH_TRUST_HOST=true` et `CC_DOCKER_EXPOSED_HTTP_PORT=3000`
- [ ] Migrations appliquées (automatique au démarrage via le `Dockerfile`)
- [ ] Premier admin créé puis **mot de passe par défaut changé**
- [ ] Avant de stocker de vraies données clients : passer le plan Postgres en
      payant (volume + sauvegardes) et signer le **DPA** Clever Cloud (RGPD)

---

## Annexe — autres hébergeurs

Le `Dockerfile` et le build `standalone` fonctionnent tels quels ailleurs :

- **Scaleway** : Serverless Containers (push de l'image) + Managed PostgreSQL.
- **VPS Docker** : `docker compose up --build` (voir `docker-compose.yml`), avec un
  reverse-proxy (Caddy/Traefik) pour le HTTPS.
- **Vercel** : possible techniquement (région EU), mais société US → moins idéal
  pour le RGPD ; non retenu ici.

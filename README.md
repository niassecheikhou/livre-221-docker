# API LIVRE 221 - Documentation complete du projet

## 1. Vue d'ensemble

Ce projet est une API REST construite avec **Node.js**, **Express** et **Prisma** pour gerer une librairie en ligne.

Fonctionnalites principales :

- Gestion des **editeurs**
- Gestion des **livres**
- Gestion des **clients**
- Gestion des **commandes**
- **Archivage logique (soft delete)** et **restauration**

L'architecture suit une approche en couches :

`routes -> controllers -> services -> repositories -> Prisma -> PostgreSQL`

---

## 2. Technologies utilisees

- Node.js (runtime JavaScript)
- Express.js (API HTTP)
- PostgreSQL (base de donnees relationnelle)
- Prisma (ORM)
- Zod (validation des donnees)
- Swagger (documentation interactive)
- Helmet, CORS, Morgan (securite + logging)
- Nodemon (developpement)

---

## 3. Structure du projet

```text
livre-221/
|-- prisma/
|   |-- schema.prisma
|   `-- migrations/
|-- src/
|   |-- app.js
|   |-- server.js
|   |-- config/
|   |-- controllers/
|   |-- middlewares/
|   |-- repositories/
|   |-- routes/
|   |-- services/
|   |-- utils/
|   `-- validations/
|-- .env
`-- package.json
```

Roles des couches :

- `routes/` : declare les endpoints HTTP
- `controllers/` : gere req/res et delegation vers services
- `services/` : contient la logique metier
- `repositories/` : acces Prisma aux donnees
- `validations/` : schemas Zod
- `middlewares/` : validation, 404, gestion globale des erreurs

---

## 4. Modele de donnees

Entites Prisma (`prisma/schema.prisma`) :

- `Editeur`
- `Livre`
- `Client`
- `Commande`
- enum `StatutCommande` : `EN_COURS`, `EXPEDIEE`, `LIVREE`, `ANNULEE`

Relations :

- Un `Editeur` possede plusieurs `Livre`
- Un `Client` possede plusieurs `Commande`
- Un `Livre` possede plusieurs `Commande`
- Une `Commande` appartient a un seul `Client` et un seul `Livre`

Points importants :

- `archivedAt` est present sur toutes les entites (soft delete)
- `editeurs.code` est unique
- `editeurs.email` est unique
- `livres.isbn` est unique
- `clients.email` est unique

---

## 5. Regles metier

### 5.1 Editeurs

- Email unique
- Email valide et doit terminer par `@gmai.com`
- Code auto-genere si absent : `SN-XX-NNNNN`
  - `XX` = 2 premieres lettres du nom (ou `X` si nom trop court)
  - `NNNNN` = compteur global via sequence PostgreSQL `editeur_code_global_seq`
- Suppression refusee si l'editeur possede des livres actifs

### 5.2 Livres

- `isbn` est toujours genere automatiquement : `ATNNNNN`
  - `A` = initiale auteur
  - `T` = initiale titre
  - `NNNNN` = compteur global via sequence `livre_isbn_global_seq`
- Le couple `titre + auteur` est unique (un meme auteur ne peut pas avoir deux fois le meme titre)
- `editeurId` doit pointer vers un editeur actif
- Suppression refusee si au moins une commande active est en statut `EN_COURS`

### 5.3 Clients

- Email unique
- Email valide et doit terminer par `@gmai.com`
- Telephone optionnel, format attendu : `+22170/71/75/76/77/78XXXXXXX`
- Suppression refusee si le client a des commandes actives

### 5.4 Commandes

- `dateCommande` ne peut pas etre dans le futur
- `clientId` doit pointer vers un client actif
- `livreId` doit pointer vers un livre actif
- Quantite > 0 et stock suffisant obligatoire
- `montantTotal = prixLivre * quantite`
- La creation decremente le stock du livre dans une transaction Prisma
- Statut cree par defaut a `EN_COURS`

---

## 6. API Endpoints

Base URL locale :

- `http://localhost:5000/api`

Swagger UI :

- `http://localhost:5000/api-docs`

### 6.1 Editeurs

- `GET /api/editeurs` : liste des editeurs actifs
- `POST /api/editeurs` : creation d'un editeur
- `DELETE /api/editeurs/:id` : archivage d'un editeur
- `PATCH /api/editeurs/:id/restore` : restauration d'un editeur archive

Exemple `POST /api/editeurs` :

```json
{
  "nom": "Hachette",
  "email": "contact@gmai.com",
  "adresse": "Dakar"
}
```

### 6.2 Livres

- `GET /api/livres` : liste des livres actifs (inclut l'editeur)
- `POST /api/livres` : creation d'un livre
- `DELETE /api/livres/:id` : archivage d'un livre
- `PATCH /api/livres/:id/restore` : restauration d'un livre archive

Exemple `POST /api/livres` :

```json
{
  "titre": "Clean Code",
  "auteur": "Robert Martin",
  "prix": 39.99,
  "qteStock": 10,
  "editeurId": 1
}
```

### 6.3 Clients

- `GET /api/clients` : liste des clients actifs
- `POST /api/clients` : creation d'un client
- `DELETE /api/clients/:id` : archivage d'un client
- `PATCH /api/clients/:id/restore` : restauration d'un client archive

Exemple `POST /api/clients` :

```json
{
  "prenom": "Jean",
  "nom": "Dupont",
  "email": "jean.dupont@gmai.com",
  "telephone": "+221771234567",
  "adresseLivraison": "Parcelles Assainies"
}
```

### 6.4 Commandes

- `GET /api/commandes` : liste des commandes actives (inclut client, livre, editeur)
- `POST /api/commandes` : creation d'une commande
- `DELETE /api/commandes/:id` : archivage d'une commande
- `PATCH /api/commandes/:id/restore` : restauration d'une commande archivee

Exemple `POST /api/commandes` :

```json
{
  "clientId": 1,
  "livreId": 1,
  "quantite": 2,
  "dateCommande": "2026-04-13T10:30:00.000Z"
}
```

---

## 7. Format des reponses HTTP

Succes (`200`/`201`) :

```json
{
  "success": true,
  "message": "Texte de succes",
  "data": {}
}
```

Erreur :

```json
{
  "success": false,
  "message": "Message d'erreur",
  "errors": []
}
```

Cas de validation Zod :

- Status `400`
- Tableau `errors` avec `field` et `message`

---

## 8. Installation et configuration

### 8.1 Prerequis

- Node.js 18+
- PostgreSQL actif

### 8.2 Variables d'environnement

Fichier `.env` a la racine :

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/livre221_db
```

Variables lues par l'application :

- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `URI` (present dans `env.js`, non utilise dans le flux principal actuel)

### 8.3 Commandes de demarrage

Installation :

```bash
npm install
```

Generation Prisma :

```bash
npx prisma generate
```

Execution des migrations (en local dev) :

```bash
npx prisma migrate dev --name init
```

Lancer le serveur en dev :

```bash
npm run dev
```

Lancer en mode standard :

```bash
npm start
```

Build (script actuel du projet) :

```bash
npm run build
```

---

## 9. Scripts npm

- `npm run dev` : demarrage avec nodemon
- `npm start` : demarrage Node
- `npm run build` : `npm install && npx prisma generate`
- `npm test` : non implemente (retourne une erreur par defaut)

---

## 10. Depannage rapide

Erreur `P1001` Prisma (connexion DB) :

- Verifier que PostgreSQL est demarre
- Verifier `DATABASE_URL` dans `.env`

Erreur `Cannot find module '@prisma/client'` :

- Executer `npm install`
- Puis `npx prisma generate`

Port deja occupe :

- Changer `PORT` dans `.env`
- Ou liberer le processus occupant le port

---

## 11. Limites actuelles et ameliorations recommandees

- Pas de pagination ni filtrage avance sur les listes
- Pas d'authentification/autorisation
- Pas de tests automatises
- Pas d'endpoint update/getById sur les ressources
- Les erreurs metier sont souvent renvoyees en `500` (a ameliorer avec des status codes explicites : `400`, `404`, `409`)

---

## 12. Checklist de prise en main

1. Configurer `.env`
2. Executer `npm install`
3. Executer `npx prisma generate`
4. Executer `npx prisma migrate dev --name init`
5. Lancer `npm run dev`
6. Ouvrir `http://localhost:5000/api-docs`

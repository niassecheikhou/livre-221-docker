/**
 * @swagger
 * components:
 *   schemas:
 *     ClientInput:
 *       type: object
 *       required:
 *         - prenom
 *         - nom
 *         - email
 *         - adresseLivraison
 *       properties:
 *         prenom:
 *           type: string
 *           example: Jean
 *         nom:
 *           type: string
 *           example: Dupont
 *         email:
 *           type: string
 *           example: jean.dupont@gmai.com
 *         telephone:
 *           type: string
 *           example: +221771234567
 *         adresseLivraison:
 *           type: string
 *           example: 12 rue des Fleurs
 *     Client:
 *       allOf:
 *         - $ref: '#/components/schemas/ClientInput'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *     EditeurInput:
 *       type: object
 *       required:
 *         - nom
 *         - email
 *       properties:
 *         code:
 *           type: string
 *           description: Genere automatiquement au format SN-XX-NNNNN avec compteur global (ex. SN-HA-00001)
 *           example: SN-HA-00001
 *           readOnly: true
 *         nom:
 *           type: string
 *           example: Hachette
 *         adresse:
 *           type: string
 *           example: 45 avenue des Éditeurs
 *         email:
 *           type: string
 *           example: contact@gmai.com
 *     Editeur:
 *       allOf:
 *         - $ref: '#/components/schemas/EditeurInput'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *     LivreInput:
 *       type: object
 *       required:
 *         - titre
 *         - auteur
 *         - prix
 *         - qteStock
 *         - editeurId
 *       properties:
 *         isbn:
 *           type: string
 *           description: Genere automatiquement au format initialeAuteur + initialeTitre + 5 chiffres (ex. RC00001)
 *           example: RC00001
 *           readOnly: true
 *         titre:
 *           type: string
 *           example: Clean Code
 *         auteur:
 *           type: string
 *           example: Robert C. Martin
 *         prix:
 *           type: number
 *           format: float
 *           example: 39.99
 *         qteStock:
 *           type: integer
 *           example: 12
 *         editeurId:
 *           type: integer
 *           example: 1
 *     Livre:
 *       allOf:
 *         - $ref: '#/components/schemas/LivreInput'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *     CommandeInput:
 *       type: object
 *       required:
 *         - clientId
 *         - livreId
 *         - quantite
 *         - dateCommande
 *       properties:
 *         clientId:
 *           type: integer
 *           example: 1
 *         livreId:
 *           type: integer
 *           example: 1
 *         quantite:
 *           type: integer
 *           example: 2
 *         dateCommande:
 *           type: string
 *           format: date-time
 *           example: 2026-04-03T10:30:00Z
 *     Commande:
 *       allOf:
 *         - $ref: '#/components/schemas/CommandeInput'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *   responses:
 *     NotFound:
 *       description: Ressource non trouvée
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Ressource non trouvée
 *     BadRequest:
 *       description: Requête invalide
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Requête invalide
 * tags:
 *   - name: Clients
 *     description: Gestion des clients
 *   - name: Éditeurs
 *     description: Gestion des éditeurs
 *   - name: Livres
 *     description: Gestion des livres
 *   - name: Commandes
 *     description: Gestion des commandes
 * /api/clients:
 *   get:
 *     summary: Récupérer tous les clients
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: Liste des clients récupérée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 *   post:
 *     summary: Créer un nouveau client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientInput'
 *     responses:
 *       201:
 *         description: Client créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 * /api/clients/{id}:
 *   delete:
 *     summary: Supprimer un client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du client
 *     responses:
 *       200:
 *         description: Client supprimé
 *       404:
 *         $ref: '#/components/responses/NotFound'
 * /api/editeurs:
 *   get:
 *     summary: Récupérer tous les éditeurs
 *     tags: [Éditeurs]
 *     responses:
 *       200:
 *         description: Liste des éditeurs récupérée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Editeur'
 *   post:
 *     summary: Créer un nouvel éditeur
 *     description: Cree un nouvel editeur. Le code est genere automatiquement au format SN-XX-NNNNN (SN + 2 premieres lettres du nom + 5 chiffres) avec un compteur global.
 *     tags: [Éditeurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditeurInput'
 *           example:
 *             nom: Hachette
 *             email: contact@gmai.com
 *             adresse: 45 avenue des Éditeurs
 *     responses:
 *       201:
 *         description: Éditeur créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Editeur'
 * /api/editeurs/{id}:
 *   delete:
 *     summary: Supprimer un éditeur
 *     tags: [Éditeurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'éditeur
 *     responses:
 *       200:
 *         description: Éditeur supprimé
 *       404:
 *         $ref: '#/components/responses/NotFound'
 * /api/livres:
 *   get:
 *     summary: Récupérer tous les livres
 *     tags: [Livres]
 *     responses:
 *       200:
 *         description: Liste des livres récupérée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Livre'
 *   post:
 *     summary: Créer un nouveau livre
 *     description: Cree un nouveau livre. L'ISBN est genere automatiquement au format initialeAuteur + initialeTitre + 5 chiffres. Le couple titre + auteur doit etre unique.
 *     tags: [Livres]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LivreInput'
 *     responses:
 *       201:
 *         description: Livre créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Livre'
 * /api/livres/{id}:
 *   delete:
 *     summary: Supprimer un livre
 *     tags: [Livres]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du livre
 *     responses:
 *       200:
 *         description: Livre supprimé
 *       404:
 *         $ref: '#/components/responses/NotFound'
 * /api/commandes:
 *   get:
 *     summary: Récupérer toutes les commandes
 *     tags: [Commandes]
 *     responses:
 *       200:
 *         description: Liste des commandes récupérée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Commande'
 *   post:
 *     summary: Créer une nouvelle commande
 *     tags: [Commandes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommandeInput'
 *     responses:
 *       201:
 *         description: Commande créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commande'
 */



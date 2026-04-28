import express from 'express';
import editeurRoutes from './editeur.routes.js';
import livreRoutes from './livre.routes.js';
import clientRoutes from './client.routes.js';
import commandeRoutes from './commande.routes.js';

const router = express.Router();

router.use('/editeurs', editeurRoutes);
router.use('/livres', livreRoutes);
router.use('/clients', clientRoutes);
router.use('/commandes', commandeRoutes);

export default router;
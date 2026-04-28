import express from 'express';
import controller from '../controllers/commande.controller.js';
import validate from '../middlewares/validate.js';
import { createCommandeSchema } from '../validations/commande.schema.js';

const router = express.Router();

router.get('/', controller.getAll);
router.post('/', validate(createCommandeSchema), controller.create);
router.delete('/:id', controller.remove);
router.patch('/:id/restore', controller.restore);

export default router;

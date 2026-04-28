import express from 'express';
import controller from '../controllers/editeur.controller.js';
import validate from '../middlewares/validate.js';
import { createEditeurSchema } from '../validations/editeur.schema.js';

const router = express.Router();

router.get('/', controller.getAll);
router.post('/', validate(createEditeurSchema), controller.create);
router.delete('/:id', controller.remove);
router.patch('/:id/restore', controller.restore);

export default router;

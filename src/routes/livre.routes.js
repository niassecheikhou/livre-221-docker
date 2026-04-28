import express from 'express';
import controller from '../controllers/livre.controller.js';
import validate from '../middlewares/validate.js';
import { createLivreSchema } from '../validations/livre.schema.js';

const router = express.Router();

router.get('/', controller.getAll);
router.post('/', validate(createLivreSchema), controller.create);
router.delete('/:id', controller.remove);
router.patch('/:id/restore', controller.restore);

export default router;

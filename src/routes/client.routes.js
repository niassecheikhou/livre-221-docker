import express from 'express';
import controller from '../controllers/client.controller.js';
import validate from '../middlewares/validate.js';
import { createClientSchema } from '../validations/client.schema.js';

const router = express.Router();

router.get('/', controller.getAll);
router.post('/', validate(createClientSchema), controller.create);
router.delete('/:id', controller.remove);
router.patch('/:id/restore', controller.restore);

export default router;

import { z } from 'zod';

const createLivreSchema = z.object({
  body: z.object({
    isbn: z.string().optional(),
    titre: z.string().trim().min(1, 'Titre obligatoire'),
    auteur: z.string().trim().min(1, 'Auteur obligatoire'),
    prix: z.number().positive('Le prix doit etre > 0'),
    qteStock: z.number().int().min(0, 'Le stock doit etre >= 0'),
    editeurId: z.number().int().positive('editeurId est invalide')
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export {
  createLivreSchema
};

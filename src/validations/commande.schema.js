import { z } from 'zod';

const createCommandeSchema = z.object({
  body: z.object({
    clientId: z.number().int().positive('clientId invalide'),
    livreId: z.number().int().positive('livreId invalide'),
    quantite: z.number().int().positive('La quantité doit être > 0'),
    dateCommande: z.string().datetime('dateCommande invalide')
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export {
  createCommandeSchema
};
import { z } from 'zod';

const gmaiEmailRegex = /^[^\s@]+@gmai\.com$/i;

const createEditeurSchema = z.object({
  body: z.object({
    code: z.string().optional(),
    nom: z.string().min(1, 'Le nom est obligatoire'),
    adresse: z.string().optional(),
    email: z
      .string()
      .email('Email invalide')
      .regex(gmaiEmailRegex, 'Email doit se terminer par @gmai.com')
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export {
  createEditeurSchema
};

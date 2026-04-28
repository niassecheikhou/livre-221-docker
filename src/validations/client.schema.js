import { z } from 'zod';

const senegalPhoneRegex = /^\+221(70|71|75|76|77|78)\d{7}$/;
const gmaiEmailRegex = /^[^\s@]+@gmai\.com$/i;

const createClientSchema = z.object({
  body: z.object({
    prenom: z.string().min(1, 'Prenom obligatoire'),
    nom: z.string().min(1, 'Nom obligatoire'),
    email: z
      .string()
      .email('Email invalide')
      .regex(gmaiEmailRegex, 'Email doit se terminer par @gmai.com'),
    telephone: z
      .string()
      .regex(
        senegalPhoneRegex,
        'le format du numero de telephone est incorrete'
      )
      .optional(),
    adresseLivraison: z.string().min(1, 'Adresse de livraison obligatoire')
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export {
  createClientSchema
};

import prismaDb from '../config/db.js';
import commandeRepo from '../repositories/commande.repo.js';

class CommandeService {
  async create(data) {
    const prisma = prismaDb.getClient();
    const dateCommande = new Date(data.dateCommande);
    const today = new Date();

    if (dateCommande > today) {
      throw new Error('La date de commande ne peut pas etre dans le futur');
    }

    return prisma.$transaction(async (tx) => {
      const client = await tx.client.findFirst({
        where: {
          id: data.clientId,
          archivedAt: null
        }
      });

      if (!client) {
        throw new Error('Client introuvable ou archive');
      }

      const livre = await tx.livre.findFirst({
        where: {
          id: data.livreId,
          archivedAt: null
        }
      });

      if (!livre) {
        throw new Error('Livre introuvable ou archive');
      }

      if (livre.qteStock < data.quantite) {
        throw new Error('Stock insuffisant');
      }

      const montantTotal = Number(livre.prix) * data.quantite;

      await tx.livre.update({
        where: { id: livre.id },
        data: {
          qteStock: {
            decrement: data.quantite
          }
        }
      });

      const commande = await tx.commande.create({
        data: {
          clientId: data.clientId,
          livreId: data.livreId,
          quantite: data.quantite,
          dateCommande,
          montantTotal,
          statut: 'EN_COURS'
        },
        include: {
          client: true,
          livre: true
        }
      });

      return commande;
    });
  }

  async getAll() {
    return commandeRepo.findAllDetailed();
  }

  async remove(id) {
    const commande = await commandeRepo.findByIdActive(id);

    if (!commande) {
      throw new Error('Commande introuvable');
    }

    return commandeRepo.delete(id);
  }

  async restore(id) {
    const commande = await commandeRepo.findById(id);

    if (!commande) {
      throw new Error('Commande introuvable');
    }

    if (!commande.archivedAt) {
      throw new Error("Cette commande n'est pas archivee");
    }

    return commandeRepo.restore(id);
  }
}

export default new CommandeService();

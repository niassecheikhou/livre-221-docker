import prismaDb from '../config/db.js';
import livreRepo from '../repositories/livre.repo.js';

class LivreService {
  async generateIsbn(auteur, titre) {
    const auteurInitial = ((auteur || '').trim().charAt(0) || 'X').toUpperCase();
    const titreInitial = ((titre || '').trim().charAt(0) || 'X').toUpperCase();
    const prefix = `${auteurInitial}${titreInitial}`;

    const nextNumber = await livreRepo.getNextGlobalIsbnCounter();
    const formattedNumber = String(nextNumber).padStart(5, '0');

    return `${prefix}${formattedNumber}`;
  }

  async create(data) {
    const prisma = prismaDb.getClient();
    const normalizedTitre = data.titre.trim();
    const normalizedAuteur = data.auteur.trim();

    const editeur = await prisma.editeur.findFirst({
      where: {
        id: data.editeurId,
        archivedAt: null
      }
    });

    if (!editeur) {
      throw new Error("L'editeur specifie n'existe pas ou est archive");
    }

    const livreExistant = await livreRepo.findByTitreAuteur(normalizedTitre, normalizedAuteur);
    if (livreExistant) {
      const error = new Error('Ce titre existe deja pour cet auteur');
      error.statusCode = 409;
      throw error;
    }

    const payload = {
      ...data,
      titre: normalizedTitre,
      auteur: normalizedAuteur,
      isbn: await this.generateIsbn(normalizedAuteur, normalizedTitre)
    };

    try {
      return await livreRepo.create(payload);
    } catch (error) {
      if (
        error?.code === 'P2002' &&
        Array.isArray(error?.meta?.target) &&
        error.meta.target.includes('titre') &&
        error.meta.target.includes('auteur')
      ) {
        const conflictError = new Error('Ce titre existe deja pour cet auteur');
        conflictError.statusCode = 409;
        throw conflictError;
      }

      throw error;
    }
  }

  async getAll() {
    return livreRepo.findAllActive({
      include: { editeur: true },
      orderBy: { id: 'desc' }
    });
  }

  async remove(id) {
    const livre = await livreRepo.findWithCommandes(id);

    if (!livre) {
      throw new Error('Livre introuvable');
    }

    const commandeEnCours = livre.commandes.find((c) => c.statut === 'EN_COURS');

    if (commandeEnCours) {
      throw new Error('Suppression interdite : ce livre a des commandes EN_COURS');
    }

    return livreRepo.delete(id);
  }

  async restore(id) {
    const livre = await livreRepo.findById(id);

    if (!livre) {
      throw new Error('Livre introuvable');
    }

    if (!livre.archivedAt) {
      throw new Error("Ce livre n'est pas archive");
    }

    return livreRepo.restore(id);
  }
}

export default new LivreService();

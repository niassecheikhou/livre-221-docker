import editeurRepo from '../repositories/editeur.repo.js';

class EditeurService {
  async generateCode(nom) {
    const normalizedName = (nom || '').trim();
    const prefix = normalizedName.substring(0, 2).toUpperCase().padEnd(2, 'X');
    const codePrefix = `SN-${prefix}-`;

    const nextNumber = await editeurRepo.getNextGlobalCodeCounter();
    const formattedNumber = String(nextNumber).padStart(5, '0');

    return `${codePrefix}${formattedNumber}`;
  }

  async create(data) {
    const editeurParEmail = await editeurRepo.findByEmail(data.email);
    if (editeurParEmail) {
      throw new Error('Un editeur avec cet email existe deja');
    }

    if (!data.code) {
      data.code = await this.generateCode(data.nom);
    } else {
      const codeEditeur = await editeurRepo.findByCode(data.code);
      if (codeEditeur) {
        throw new Error('Ce code editeur existe deja');
      }
    }

    return editeurRepo.create(data);
  }

  async getAll() {
    return editeurRepo.findAllActive({
      orderBy: { id: 'desc' }
    });
  }

  async remove(id) {
    const editeurParLivre = await editeurRepo.findWithLivres(id);

    if (!editeurParLivre) {
      throw new Error('Editeur introuvable');
    }

    const livres = editeurParLivre.livres && editeurParLivre.livres.length > 0;
    if (livres) {
      throw new Error('Suppression interdite : cet editeur possede deja des livres');
    }

    return editeurRepo.delete(id);
  }

  async restore(id) {
    const editeur = await editeurRepo.findById(id);

    if (!editeur) {
      throw new Error('Editeur introuvable');
    }

    if (!editeur.archivedAt) {
      throw new Error("Cet editeur n'est pas archive");
    }

    return editeurRepo.restore(id);
  }
}

export default new EditeurService();

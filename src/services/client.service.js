import clientRepo from '../repositories/client.repo.js';

class ClientService {
  async create(data) {
    const existingEmail = await clientRepo.findByEmail(data.email);
    if (existingEmail) {
      throw new Error('Cet email client existe deja');
    }

    return clientRepo.create(data);
  }

  async getAll() {
    return clientRepo.findAllActive({
      orderBy: { id: 'desc' }
    });
  }

  async remove(id) {
    const clientParCommande = await clientRepo.findWithCommandes(id);

    if (!clientParCommande) {
      throw new Error('Client introuvable');
    }

    if (clientParCommande.commandes.length > 0) {
      throw new Error('Suppression interdite : ce client a deja des commandes');
    }

    return clientRepo.delete(id);
  }

  async restore(id) {
    const client = await clientRepo.findById(id);

    if (!client) {
      throw new Error('Client introuvable');
    }

    if (!client.archivedAt) {
      throw new Error("Ce client n'est pas archive");
    }

    return clientRepo.restore(id);
  }
}

export default new ClientService();

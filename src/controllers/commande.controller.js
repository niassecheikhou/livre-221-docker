import commandeService from '../services/commande.service.js';
import { ok, created } from '../utils/response.js';

class CommandeController {
  async create(req, res, next) {
    try {
      const commande = await commandeService.create(req.validatedData.body);
      return created(res, commande, 'Commande creee avec succes');
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const commandes = await commandeService.getAll();
      return ok(res, commandes, 'Liste des commandes actives');
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      await commandeService.remove(Number(req.params.id));
      return ok(res, null, 'Commande archivee avec succes');
    } catch (error) {
      next(error);
    }
  }

  async restore(req, res, next) {
    try {
      const commande = await commandeService.restore(Number(req.params.id));
      return ok(res, commande, 'Commande restauree avec succes');
    } catch (error) {
      next(error);
    }
  }
}

export default new CommandeController();

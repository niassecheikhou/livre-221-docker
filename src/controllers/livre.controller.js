import livreService from '../services/livre.service.js';
import { ok, created } from '../utils/response.js';

class LivreController {
  async create(req, res, next) {
    try {
      const livre = await livreService.create(req.validatedData.body);
      return created(res, livre, 'Livre cree avec succes');
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const livres = await livreService.getAll();
      return ok(res, livres, 'Liste des livres actifs');
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      await livreService.remove(Number(req.params.id));
      return ok(res, null, 'Livre archive avec succes');
    } catch (error) {
      next(error);
    }
  }

  async restore(req, res, next) {
    try {
      const livre = await livreService.restore(Number(req.params.id));
      return ok(res, livre, 'Livre restaure avec succes');
    } catch (error) {
      next(error);
    }
  }
}

export default new LivreController();

import editeurService from '../services/editeur.service.js';
import { ok, created } from '../utils/response.js';

class EditeurController {
  async create(req, res, next) {
    try {
      const editeur = await editeurService.create(req.validatedData.body);
      return created(res, editeur, 'Editeur cree avec succes');
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const editeurs = await editeurService.getAll();
      return ok(res, editeurs, 'Liste des editeurs actifs');
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      await editeurService.remove(Number(req.params.id));
      return ok(res, null, 'Editeur archive avec succes');
    } catch (error) {
      next(error);
    }
  }

  async restore(req, res, next) {
    try {
      const editeur = await editeurService.restore(Number(req.params.id));
      return ok(res, editeur, 'Editeur restaure avec succes');
    } catch (error) {
      next(error);
    }
  }
}

export default new EditeurController();

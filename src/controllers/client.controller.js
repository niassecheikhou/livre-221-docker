import clientService from '../services/client.service.js';
import { ok, created } from '../utils/response.js';

class ClientController {
  async create(req, res, next) {
    try {
      const client = await clientService.create(req.validatedData.body);
      return created(res, client, 'Client cree avec succes');
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const clients = await clientService.getAll();
      return ok(res, clients, 'Liste des clients actifs');
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      await clientService.remove(Number(req.params.id));
      return ok(res, null, 'Client archive avec succes');
    } catch (error) {
      next(error);
    }
  }

  async restore(req, res, next) {
    try {
      const client = await clientService.restore(Number(req.params.id));
      return ok(res, client, 'Client restaure avec succes');
    } catch (error) {
      next(error);
    }
  }
}

export default new ClientController();

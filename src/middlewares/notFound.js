import { fail } from '../utils/response.js';

function notFound(req, res) {
  return fail(res, `Route introuvable : ${req.originalUrl}`, 404);
}

export default notFound;
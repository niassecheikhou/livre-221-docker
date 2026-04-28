import { fail } from '../utils/response.js';

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'ZodError') {
    const issues = err.issues || err.errors || [];
    const formattedErrors = issues.map((issue) => ({
      field: (() => {
        const path = issue.path || [];
        const withoutScope =
          ['body', 'params', 'query'].includes(path[0]) ? path.slice(1) : path;
        return withoutScope.join('.') || 'requete';
      })(),
      message: issue.message
    }));

    const firstError = formattedErrors[0];
    const clearMessage = firstError
      ? firstError.message
      : 'Validation invalide';

    return fail(res, clearMessage, 400, formattedErrors);
  }

  return fail(res, err.message || 'Erreur interne du serveur', err.statusCode || 500);
}

export default errorHandler;

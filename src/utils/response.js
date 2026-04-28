const ok = (res, data = null, message = 'Succès', status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data
  });
};

const created = (res, data = null, message = 'Créé avec succès') => {
  return res.status(201).json({
    success: true,
    message,
    data
  });
};

const fail = (res, message = 'Erreur', status = 400, errors = null) => {
  return res.status(status).json({
    success: false,
    message,
    errors
  });
};

export {
  ok,
  created,
  fail
};
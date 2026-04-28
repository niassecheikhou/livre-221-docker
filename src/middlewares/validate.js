function validate(schema) {
  return (req, res, next) => {
    try {
      req.validatedData = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      });
      next();
    } catch (error) {
      next(error);
    }
  };
}

export default validate;
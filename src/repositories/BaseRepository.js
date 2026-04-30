class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  buildActiveWhere(where = {}) {
    return {
      AND: [where, { archivedAt: null }]
    };
  }

  findAll(options = {}) {
    return this.model.findMany(options);
  }

  findAllActive(options = {}) {
    return this.model.findMany({
      ...options,
      where: this.buildActiveWhere(options.where || {})
    });
  }

  findById(id, options = {}) {
    return this.model.findUnique({
      where: { id },
      ...options
    });
  }

  findByIdActive(id, options = {}) {
    return this.model.findFirst({
      ...options,
      where: this.buildActiveWhere({ id })
    });
  }

  create(data) {
    return this.model.create({ data });
  }

  update(id, data) {
    return this.model.update({
      where: { id },
      data
    });
  }

  delete(id) {
    return this.model.update({
      where: { id },
      data: { archivedAt: new Date() }
    });
  }

  restore(id) {
    return this.model.update({
      where: { id },
      data: { archivedAt: null }
    });
  }

  hardDelete(id) {
    return this.model.delete({
      where: { id }
    });
  }
     

  
}

export default BaseRepository;

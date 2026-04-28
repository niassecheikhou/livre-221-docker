import prismaDb from '../config/db.js';
import BaseRepository from './BaseRepository.js';

class EditeurRepository extends BaseRepository {
  constructor() {
    super(prismaDb.getClient().editeur);
  }

  findByCode(code) {
    const prisma = prismaDb.getClient();
    return prisma.editeur.findUnique({ where: { code } });
  }

  findWithLivres(id) {
    const prisma = prismaDb.getClient();
    return prisma.editeur.findFirst({
      where: {
        id,
        archivedAt: null
      },
      include: {
        livres: {
          where: { archivedAt: null }
        }
      }
    });
  }

  async getNextGlobalCodeCounter() {
    const prisma = prismaDb.getClient();
    const [result] = await prisma.$queryRaw`
      SELECT nextval('editeur_code_global_seq') AS value
    `;

    return Number(result.value);
  }

  findByEmail(email) {
    const prisma = prismaDb.getClient();
    return prisma.editeur.findUnique({ where: { email } });
  }
}

export default new EditeurRepository();

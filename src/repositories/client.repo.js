import prismaDb from '../config/db.js';
import BaseRepository from './BaseRepository.js';

class ClientRepository extends BaseRepository {
  constructor() {
    super(prismaDb.getClient().client);
  }

  findByEmail(email) {
    const prisma = prismaDb.getClient();
    return prisma.client.findUnique({ where: { email } });
  }

  findWithCommandes(id) {
    const prisma = prismaDb.getClient();
    return prisma.client.findFirst({
      where: {
        id,
        archivedAt: null
      },
      include: {
        commandes: {
          where: { archivedAt: null }
        }
      }
    });
  }
}

export default new ClientRepository();

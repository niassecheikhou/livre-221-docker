import prismaDb from '../config/db.js';
import BaseRepository from './BaseRepository.js';

class CommandeRepository extends BaseRepository {
  constructor() {
    super(prismaDb.getClient().commande);
  }

  findAllDetailed() {
    const prisma = prismaDb.getClient();
    return prisma.commande.findMany({
      where: {
        archivedAt: null
      },
      include: {
        client: true,
        livre: {
          include: {
            editeur: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  findByLivreAndStatus(livreId, statut) {
    const prisma = prismaDb.getClient();
    return prisma.commande.findFirst({
      where: { livreId, statut, archivedAt: null }
    });
  }
}

export default new CommandeRepository();

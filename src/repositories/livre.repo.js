import prismaDb from '../config/db.js';
import BaseRepository from './BaseRepository.js';

class LivreRepository extends BaseRepository {
  constructor() {
    super(prismaDb.getClient().livre);
  }

  findByISBN(isbn) {
    const prisma = prismaDb.getClient();
    return prisma.livre.findUnique({ where: { isbn } });
  }

  findByTitreAuteur(titre, auteur) {
    const prisma = prismaDb.getClient();
    return prisma.livre.findFirst({
      where: {
        titre: {
          equals: titre,
          mode: 'insensitive'
        },
        auteur: {
          equals: auteur,
          mode: 'insensitive'
        }
      }
    });
  }

  async getNextGlobalIsbnCounter() {
    const prisma = prismaDb.getClient();
    const [result] = await prisma.$queryRaw`
      SELECT nextval('livre_isbn_global_seq') AS value
    `;

    return Number(result.value);
  }

  findWithCommandes(id) {
    const prisma = prismaDb.getClient();
    return prisma.livre.findFirst({
      where: {
        id,
        archivedAt: null
      },
      include: {
        commandes: {
          where: { archivedAt: null }
        },
        editeur: true
      }
    });
  }
}

export default new LivreRepository();

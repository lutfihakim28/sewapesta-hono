import { Package } from '@/schemas/packages/PackageSchema';
import { db } from 'db';

export abstract class PackageService {
  static async getList(): Promise<Array<Package>> {
    const packages = await db.transaction(async (transaction) => {
      const _packages = await transaction.query.packagesTable.findMany({
        columns: {
          id: true,
          name: true,
          price: true,
          overtimeRatio: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return _packages
    })

    return packages;
  }
}
import { buildOrderBy } from '@/lib/utils/build-order-by';
import { Package, PackageFilter, PackageList, PackageRequest } from './Package.schema';
import { packages } from 'db/schema/packages';
import { and, count, eq, isNull, like } from 'drizzle-orm';
import { db } from 'db';
import { users } from 'db/schema/users';
import { products } from 'db/schema/products';
import { countOffset } from '@/lib/utils/count-offset';
import { packageColumns } from './Package.column';
import { profiles } from 'db/schema/profiles';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { messages } from '@/lib/constants/messages';
import { UserService } from '../users/User.service';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { ProductService } from '../products/Product.service';
import dayjs from 'dayjs';

export class PackageService {
  static async list(query: PackageFilter): Promise<[PackageList, number]> {
    const orderBy = buildOrderBy(packages, query.sortBy || 'id', query.sort);

    const conditions: ReturnType<typeof and>[] = [
      isNull(packages.deletedAt),
    ];

    if (query.ownerId) {
      conditions.push(eq(packages.ownerId, +query.ownerId))
    }

    if (query.productId) {
      conditions.push(eq(packages.productId, +query.productId))
    }

    if (query.term) {
      conditions.push(eq(packages.term, query.term))
    }

    if (query.keyword) {
      conditions.push(like(packages.name, `%${query.keyword}%`))
    }

    const [_packages, [meta]] = await Promise.all([
      db
        .select({
          ...packageColumns,
          ownerName: profiles.name,
          ownerPhone: profiles.phone,
          productName: products.name
        })
        .from(packages)
        .innerJoin(users, eq(users.id, packages.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .leftJoin(products, eq(products.id, packages.productId))
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      db.select({
        count: count().mapWith(Number)
      })
        .from(packages)
        .where(and(...conditions))
    ])

    return [_packages, meta.count]
  }

  static async get(id: number): Promise<Package> {
    const [_package] = await db.select(packageColumns)
      .from(packages)
      .where(and(
        isNull(packages.deletedAt),
        eq(packages.id, id)
      ))
      .limit(1);

    if (!_package) {
      throw new NotFoundException(messages.errorNotFound(`Package with ID ${id}`))
    }

    return _package
  }

  static async create(payload: PackageRequest): Promise<Package> {
    await UserService.check(payload.ownerId, [RoleEnum.Owner])
    if (payload.productId) {
      await ProductService.check(payload.productId)
    }

    const [newPackage] = await db
      .insert(packages)
      .values(payload)
      .returning(packageColumns);

    return newPackage;
  }

  static async update(id: number, payload: PackageRequest): Promise<Package> {
    await UserService.check(payload.ownerId, [RoleEnum.Owner])
    if (payload.productId) {
      await ProductService.check(payload.productId)
    }

    const [updatedPackage] = await db
      .update(packages)
      .set(payload)
      .where(and(
        isNull(packages.deletedAt),
        eq(packages.id, id)
      ))
      .returning(packageColumns);

    if (!updatedPackage) {
      throw new NotFoundException(messages.errorNotFound(`Package with ID ${id}`))
    }

    return updatedPackage;
  }

  static async delete(id: number) {
    const [deletedPackage] = await db
      .update(packages)
      .set({
        deletedAt: dayjs().unix(),
      })
      .where(and(
        isNull(packages.deletedAt),
        eq(packages.id, id)
      ))
      .returning(packageColumns);

    if (!deletedPackage) {
      throw new NotFoundException(messages.errorNotFound(`Package with ID ${id}`))
    }
  }

  private constructor() { }
}
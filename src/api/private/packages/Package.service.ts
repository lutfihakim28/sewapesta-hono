import { Package, PackageColumn, PackageFilter, PackageList, PackageListColumn, PackageRequest, sortablePackageColumns } from './Package.schema';
import { packages } from 'db/schema/packages';
import { and, asc, count, desc, eq, isNull, like, or, SQL } from 'drizzle-orm';
import { db } from 'db';
import { users } from 'db/schema/users';
import { products } from 'db/schema/products';
import { countOffset } from '@/utils/helpers/count-offset';
import { packageColumns } from './Package.column';
import { profiles } from 'db/schema/profiles';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';
import { messages } from '@/utils/constants/messages';
import { UserService } from '../users/User.service';
import { RoleEnum } from '@/utils/enums/RoleEnum';
import { ProductService } from '../products/Product.service';
import { AppDate } from '@/utils/libs/AppDate';

export class PackageService {
  static async list(query: PackageFilter): Promise<[PackageList, number]> {
    let orders: SQL<unknown>[] = [];

    query.asc.forEach((col) => {
      if (!sortablePackageColumns.includes(col as PackageListColumn)) return;
      if (query.desc.includes(col as PackageListColumn)) return;
      if (col === 'product') {
        orders.push(asc(products.name))
        return;
      }
      if (col === 'owner') {
        orders.push(asc(profiles.name))
        return;
      }
      orders.push(asc(packages[col as PackageColumn]))
    })

    query.desc.forEach((col) => {
      if (!sortablePackageColumns.includes(col as PackageListColumn)) return;
      if (query.asc.includes(col as PackageListColumn)) return;
      if (col === 'product') {
        orders.push(desc(products.name))
        return;
      }
      if (col === 'owner') {
        orders.push(desc(profiles.name))
        return;
      }
      orders.push(desc(packages[col as PackageColumn]))
    })

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
      conditions.push(or(
        like(packages.name, `%${query.keyword}%`),
        like(profiles.name, `%${query.keyword}%`),
        like(profiles.phone, `%${query.keyword}%`),
        like(products.name, `%${query.keyword}%`),
      ))
    }

    const [_packages, [meta]] = await Promise.all([
      db
        .select({
          ...packageColumns,
          owner: {
            id: users.id,
            name: profiles.name,
            phone: profiles.phone,
          },
          product: {
            id: products.id,
            name: products.name
          }
        })
        .from(packages)
        .innerJoin(users, eq(users.id, packages.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .leftJoin(products, eq(products.id, packages.productId))
        .where(and(...conditions))
        .orderBy(...orders)
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
        deletedAt: new AppDate().unix,
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
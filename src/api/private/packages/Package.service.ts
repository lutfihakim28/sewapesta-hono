import { Package, PackageColumn, PackageFilter, PackageList, PackageRequest } from './Package.schema';
import { packages } from 'db/schema/packages';
import { and, asc, count, desc, eq, isNull, like, or } from 'drizzle-orm';
import { db } from 'db';
import { products } from 'db/schema/products';
import { countOffset } from '@/utils/helpers/count-offset';
import { packageColumns } from './Package.column';
import { profiles } from 'db/schema/profiles';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';
import { ProductService } from '../products/Product.service';
import { AppDate } from '@/utils/libs/AppDate';
import { ConstraintException } from '@/utils/exceptions/ConstraintException';
import { Option } from '@/utils/schemas/Option.schema';
import { SortByEnum } from '@/utils/enums/SortByEnum';

export class PackageService {
  static async list(query: PackageFilter): Promise<[PackageList, number]> {
    const conditions: ReturnType<typeof and>[] = [
      isNull(packages.deletedAt),
    ];

    if (query.productId) {
      conditions.push(eq(packages.productId, +query.productId))
    }

    if (query.keyword) {
      conditions.push(or(
        like(packages.name, `%${query.keyword}%`),
        like(profiles.name, `%${query.keyword}%`),
        like(profiles.phone, `%${query.keyword}%`),
        like(products.name, `%${query.keyword}%`),
      ))
    }

    let listingQuery = db
      .select({
        ...packageColumns,
        product: {
          id: products.id,
          name: products.name
        }
      })
      .from(packages)
      .leftJoin(products, eq(products.id, packages.productId))
      .where(and(...conditions))
      .$dynamic()

    if (query.sort && query.sortBy) {
      const orderFn = query.sortBy === SortByEnum.Desc ? desc : asc;
      const sort = query.sort as PackageColumn;
      const order = orderFn(packages[sort]);

      listingQuery = listingQuery.orderBy(order);
    }

    const [_packages, [meta]] = await Promise.all([
      listingQuery
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

    return _package
  }

  static async create(payload: PackageRequest): Promise<Package> {
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
      throw new NotFoundException('package', id)
    }

    return updatedPackage;
  }

  static async delete(id: number) {
    const [deletedPackage] = await db
      .update(packages)
      .set({
        deletedAt: new AppDate().unix(),
      })
      .where(and(
        isNull(packages.deletedAt),
        eq(packages.id, id)
      ))
      .returning(packageColumns);

    if (!deletedPackage) {
      throw new NotFoundException('package', id)
    }
  }

  static async check(id: number) {
    const conditions = [
      isNull(packages.deletedAt),
      eq(packages.id, id)
    ]

    const [_package] = await db
      .select(packageColumns)
      .from(packages)
      .where(and(
        ...conditions
      ))
      .limit(1)

    if (!_package) {
      throw new ConstraintException('package', id)
    }
  }

  static async options(): Promise<Option[]> {
    return await db
      .select({
        label: packages.name,
        value: packages.id
      })
      .from(packages)
      .where(isNull(packages.deletedAt))
  }

  private constructor() { }
}
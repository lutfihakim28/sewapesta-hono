import { Package, PackageColumn, PackageFilter, PackageList, PackageListColumn, PackageRequest, sortablePackageColumns } from './Package.schema';
import { packages } from 'db/schema/packages';
import { and, asc, count, desc, eq, isNull, like, or, SQL } from 'drizzle-orm';
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

export class PackageService {
  static async list(query: PackageFilter): Promise<[PackageList, number]> {
    let orders: SQL<unknown>[] = [];

    const pushOrders = (
      cols: string | string[] | undefined,
      direction: 'asc' | 'desc'
    ) => {
      const targetCols = Array.isArray(cols) ? cols : [cols];
      const isAsc = direction === 'asc';
      const opposite = isAsc ? 'desc' : 'asc';

      targetCols.forEach((col) => {
        if (!sortablePackageColumns.includes(col as PackageListColumn)) return;
        if ((query[opposite] as PackageListColumn[]).includes(col as PackageListColumn)) return;

        const orderFn = isAsc ? asc : desc;
        if (col === 'product') {
          orders.push(orderFn(products.name))
          return;
        }
        if (col === 'owner') {
          orders.push(orderFn(profiles.name))
          return;
        }
        orders.push(orderFn(packages[col as PackageColumn]));
      });
    };

    pushOrders(query.asc, 'asc');
    pushOrders(query.desc, 'desc');

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

    const [_packages, [meta]] = await Promise.all([
      db
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
import { NotFoundException } from '@/utils/exceptions/NotFoundException';
import { countOffset } from '@/utils/helpers/count-offset';
import { db } from 'db';
import { products } from 'db/schema/products';
import { and, asc, count, desc, eq, isNull, like, not } from 'drizzle-orm';
import { productColumns } from './Product.column';
import { Product, ProductCreateMany, ProductFilter, ProductRequest } from './Product.schema';
import { AppDate } from '@/utils/libs/AppDate';
import { ConstraintException } from '@/utils/exceptions/ConstraintException';
import { packages } from 'db/schema/packages';
import { pinoLogger } from '@/utils/helpers/logger';
import { Option } from '@/utils/schemas/Option.schema';
import { UniqueCheck } from '@/utils/schemas/UniqueCheck.schema';
import { UniqueConstraintException } from '@/utils/exceptions/UniqueConstraintException';

export class ProductService {
  static async list(query: ProductFilter): Promise<[Product[], number]> {
    const conditions: ReturnType<typeof and>[] = [
      isNull(products.deletedAt),
    ]

    if (query.keyword) {
      conditions.push(
        like(products.name, `%${query.keyword}%`),
      )
    }

    const [_products, [meta]] = await Promise.all([
      db.select({
        ...productColumns,
        packageCount: count(packages.id).mapWith(Number)
      })
        .from(products)
        .leftJoin(packages, and(
          isNull(packages.deletedAt),
          eq(packages.productId, products.id)
        ))
        .where(and(...conditions))
        .orderBy(desc(products.id))
        .groupBy(products.id)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      db
        .select({ count: count().mapWith(Number) })
        .from(products)
        .where(and(...conditions))
    ])

    pinoLogger.debug(_products, 'PRODUCT LIST')

    return [_products, meta.count]
  }

  static async get(id: number): Promise<Product> {
    const conditions = [
      eq(products.id, id),
      isNull(products.deletedAt),
    ]
    const [product] = await db
      .select({
        ...productColumns,
        packageCount: count(packages.id).mapWith(Number)
      })
      .from(products)
      .leftJoin(packages, and(
        isNull(packages.deletedAt),
        eq(packages.productId, products.id)
      ))
      .where(and(...conditions))
      .groupBy(products.id)
      .limit(1)

    return product
  }

  static async create(payload: ProductRequest): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(payload)
      .returning({
        id: products.id
      })

    return await this.get(newProduct.id)
  }

  static async createMany(payload: ProductCreateMany) {
    const _products = await db
      .insert(products)
      .values(payload.names.map(name => ({ name })))
      .onConflictDoNothing()
      .returning(productColumns)

    return _products.map((product) => ({
      ...product,
      packageCount: 0
    }))
  }

  static async update(id: number, payload: ProductRequest): Promise<Product> {
    const conditions = [
      eq(products.id, id),
      isNull(products.deletedAt),
    ]

    const [product] = await db
      .update(products)
      .set(payload)
      .where(and(...conditions))
      .returning(productColumns)

    if (!product) {
      throw new NotFoundException('product', id)
    }

    return await this.get(id)
  }

  static async delete(id: number): Promise<void> {
    const product = await this.get(id)
    await db
      .update(products)
      .set({ deletedAt: new AppDate().unix() })
      .where(and(
        eq(products.id, product.id)
      ))
  }

  static async check(id: number) {
    const conditions: ReturnType<typeof and>[] = [
      eq(products.id, id),
      isNull(products.deletedAt)
    ]

    const [product] = await db
      .select(productColumns)
      .from(products)
      .where(and(
        ...conditions
      ))
      .limit(1)

    if (!product) {
      throw new ConstraintException('product', id)
    }

    return product
  }

  static async checkAvailability(query: UniqueCheck) {
    const conditions = [
      isNull(products.deletedAt),
      eq(products.name, query.unique)
    ]

    if (query.selectedId) {
      conditions.push(not(eq(products.id, +query.selectedId)))
    }
    const available = await db
      .select()
      .from(products)
      .where(and(
        ...conditions
      ))

    if (available.length) {
      throw new UniqueConstraintException('product', undefined, query.unique)
    }
  }

  static async options(): Promise<Option[]> {
    return await db
      .select({
        label: products.name,
        value: products.id
      })
      .from(products)
      .where(isNull(products.deletedAt))
      .orderBy(asc(products.name))
  }

  private constructor() { }
}
import { messages } from '@/lib/constants/messages';
import { SortEnum } from '@/lib/enums/SortEnum';
import { BadRequestException } from '@/lib/exceptions/BadRequestException';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { countOffset } from '@/lib/utils/count-offset';
import dayjs from 'dayjs';
import { db } from 'db';
import { products } from 'db/schema/products';
import { and, asc, count, desc, eq, isNull, like } from 'drizzle-orm';
import { User } from '../users/User.schema';
import { productColumns } from './Product.column';
import { Product, ProductColumn, ProductFilter, ProductRequest } from './Product.schema';
import { productsItems } from 'db/schema/products-items';

export abstract class ProductService {
  static async list(query: ProductFilter): Promise<[Product[], number]> {
    let sort: SortEnum = SortEnum.Ascending;
    let sortBy: ProductColumn = 'id';

    if (query.sort) {
      sort = query.sort
    }

    if (query.sortBy) {
      sortBy = query.sortBy
    }

    const orderBy = sort === SortEnum.Ascending
      ? asc(products[sortBy])
      : desc(products[sortBy])

    const conditions: ReturnType<typeof and>[] = [
      isNull(products.deletedAt),
    ]

    if (query.keyword) {
      conditions.push(
        like(products.name, `%${query.keyword}%`),
      )
    }

    const [_products, [meta]] = await Promise.all([
      db.select(productColumns)
        .from(products)
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      db
        .select({ count: count().mapWith(Number) })
        .from(products)
        .where(and(...conditions))
    ])

    return [_products, meta.count]
  }

  static async get(id: number): Promise<Product> {
    const conditions = [
      eq(products.id, id),
      isNull(products.deletedAt),
    ]
    const [product] = await db
      .select(productColumns)
      .from(products)
      .where(and(...conditions))
      .limit(1)

    if (!product) {
      throw new NotFoundException(messages.errorNotFound(`Product with ID ${id}`));
    }

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
      throw new NotFoundException(messages.errorNotFound(`Product with ID ${id}`));
    }

    return product
  }

  static async delete(id: number): Promise<void> {
    const product = await this.get(id)
    await db
      .update(products)
      .set({ deletedAt: dayjs().unix() })
      .where(and(
        eq(products.id, product.id)
      ))

    await db
      .update(productsItems)
      .set({
        deletedAt: dayjs().unix()
      })
      .where(eq(productsItems.productId, id))
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
      throw new BadRequestException(messages.errorConstraint('Product'))
    }

    return product
  }
}
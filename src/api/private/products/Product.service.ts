import { and, asc, count, desc, eq, getTableColumns, isNull, like } from 'drizzle-orm';
import { Product, ProductColumn, ProductFilter, ProductRequest } from './Product.schema';
import { products } from 'db/schema/products';
import { SortEnum } from '@/lib/enums/SortEnum';
import { db } from 'db';
import { countOffset } from '@/lib/utils/countOffset';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { messages } from '@/lib/constants/messages';
import dayjs from 'dayjs';

const { createdAt, deletedAt, updatedAt, ...columns } = getTableColumns(products)

export abstract class ProductService {
  static async list(query: ProductFilter): Promise<Product[]> {
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

    const _products = await db
      .select(columns)
      .from(products)
      .where(this.buildWhereClause(query))
      .orderBy(orderBy)
      .limit(Number(query.pageSize || 5))
      .offset(countOffset(query.page, query.pageSize))

    return _products
  }

  static async get(id: number): Promise<Product> {
    const product = db
      .select(columns)
      .from(products)
      .where(and(
        eq(products.id, id),
        isNull(products.deletedAt)
      ))
      .get()

    if (!product) {
      throw new NotFoundException(messages.errorNotFound('product'));
    }

    return product
  }

  static async create(payload: ProductRequest): Promise<Pick<Product, 'id'>> {
    const { id, ..._ } = columns;
    const [product] = await db
      .insert(products)
      .values(payload)
      .returning({ id })

    return product
  }

  static async update(_id: number, payload: ProductRequest): Promise<Pick<Product, 'id'>> {
    const { id, ..._ } = columns;
    const [product] = await db
      .update(products)
      .set(payload)
      .where(and(
        isNull(products.deletedAt),
        eq(products.id, _id)
      ))
      .returning({ id })

    return product
  }

  static async delete(_id: number): Promise<Pick<Product, 'id'>> {
    const { id, ..._ } = columns;
    const [product] = await db
      .update(products)
      .set({ deletedAt: dayjs().unix() })
      .where(and(
        isNull(products.deletedAt),
        eq(products.id, _id)
      ))
      .returning({ id })

    return product
  }

  static async count(query: ProductFilter): Promise<number> {
    const item = db
      .select({ count: count() })
      .from(products)
      .where(this.buildWhereClause(query))
      .get()

    return item?.count || 0
  }

  private static buildWhereClause(query: ProductFilter) {
    const conditions: ReturnType<typeof and>[] = [
      isNull(products.deletedAt),
      eq(products.branchId, query.branchId)
    ]

    if (query.keyword) {
      conditions.push(
        like(products.name, `%${query.keyword}%`),
      )
    }

    return and(...conditions)
  }
}
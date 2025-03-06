import { and, asc, count, desc, eq, getTableColumns, isNull, like, SQL } from 'drizzle-orm';
import { Product, ProductColumn, ProductFilter, ProductRequest } from './Product.schema';
import { products } from 'db/schema/products';
import { SortEnum } from '@/lib/enums/SortEnum';
import { db } from 'db';
import { countOffset } from '@/lib/utils/countOffset';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { messages } from '@/lib/constants/messages';
import dayjs from 'dayjs';
import { User } from '../users/User.schema';
import { RoleEnum } from '@/lib/enums/RoleEnum';

const { createdAt, deletedAt, updatedAt, ...columns } = getTableColumns(products)

export abstract class ProductService {
  static async list(user: User, query: ProductFilter): Promise<[Product[], number]> {
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

    const where = this.buildWhereClause(user, query);

    const result = await Promise.all([
      db.select(columns)
        .from(products)
        .where(where)
        .orderBy(orderBy)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      this.count(where)
    ])

    return result
  }

  static async get(user: User, id: number): Promise<Product> {
    const conditions = [
      eq(products.id, id),
      isNull(products.deletedAt),
    ]

    if (user.role === RoleEnum.Admin) {
      conditions.push(eq(products.branchId, user.branchId))
    }
    const product = db
      .select(columns)
      .from(products)
      .where(and(...conditions))
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

  static async update(_id: number, payload: ProductRequest, user: User): Promise<Pick<Product, 'id'>> {
    const { id, ..._ } = columns;

    const conditions = [
      isNull(products.deletedAt),
      eq(products.id, _id)
    ]

    if (user.role !== RoleEnum.SuperAdmin) {
      conditions.push(
        eq(products.branchId, user.branchId)
      )
    }

    const [product] = await db
      .update(products)
      .set(payload)
      .where(and(...conditions))
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

  private static async count(query?: SQL<unknown>): Promise<number> {
    const item = db
      .select({ count: count() })
      .from(products)
      .where(query)
      .get()

    return item?.count || 0
  }

  private static buildWhereClause(user: User, query: ProductFilter) {
    const conditions: ReturnType<typeof and>[] = [
      isNull(products.deletedAt),
    ]

    if (user.role !== RoleEnum.SuperAdmin) {
      conditions.push(
        eq(products.branchId, user.branchId)
      )
    } else if (query.branchId) {
      conditions.push(
        eq(products.branchId, +query.branchId)
      )
    }

    if (query.keyword) {
      conditions.push(
        like(products.name, `%${query.keyword}%`),
      )
    }

    return and(...conditions)
  }
}
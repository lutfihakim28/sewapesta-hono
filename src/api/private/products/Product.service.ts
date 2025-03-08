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

  static async get(id: number, user?: User): Promise<Product> {
    const conditions = [
      eq(products.id, id),
      isNull(products.deletedAt),
    ]

    if (user?.role === RoleEnum.Admin) {
      conditions.push(eq(products.branchId, user.branchId))
    }
    const [product] = await db
      .select(columns)
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
      .$returningId()

    const product = await this.get(newProduct.id)

    return product
  }

  static async update(_id: number, payload: ProductRequest, user: User): Promise<Product> {
    await this.get(_id, user)
    const { id, ..._ } = columns;

    await db
      .update(products)
      .set(payload)
      .where(eq(products.id, _id))

    const product = await this.get(_id, user)

    return product
  }

  static async delete(_id: number, user: User): Promise<void> {
    const product = await this.get(_id)
    if (user.role !== RoleEnum.SuperAdmin && user.branchId !== product.branchId) {
      throw new NotFoundException('Requested Product ID is not found in your branch\'s products.')
    }
    await db
      .update(products)
      .set({ deletedAt: dayjs().unix() })
      .where(and(
        eq(products.id, product.id)
      ))
  }

  private static async count(query?: SQL<unknown>): Promise<number> {
    const [item] = await db
      .select({ count: count().mapWith(Number) })
      .from(products)
      .where(query)

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
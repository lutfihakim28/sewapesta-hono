import { messages } from '@/lib/constants/messages';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { SortEnum } from '@/lib/enums/SortEnum';
import { BadRequestException } from '@/lib/exceptions/BadRequestException';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { countOffset } from '@/lib/utils/count-offset';
import dayjs from 'dayjs';
import { db } from 'db';
import { products } from 'db/schema/products';
import { and, asc, count, desc, eq, isNull, like, SQL } from 'drizzle-orm';
import { BranchService } from '../branches/Branch.service';
import { User } from '../users/User.schema';
import { productColumns } from './Product.column';
import { Product, ProductColumn, ProductFilter, ProductRequest } from './Product.schema';

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

    const where = this.buildWhereClause(query, user);

    return await Promise.all([
      db.select(productColumns)
        .from(products)
        .where(where)
        .orderBy(orderBy)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      this.count(where)
    ])
  }

  static async get(id: number, user: User): Promise<Product> {
    const conditions = [
      eq(products.id, id),
      isNull(products.deletedAt),
    ]

    if (user.role === RoleEnum.Admin) {
      conditions.push(eq(products.branchId, user.branchId))
    }
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

  static async create(payload: ProductRequest, user: User): Promise<Product> {
    await BranchService.check(payload.branchId, user)
    const [newProduct] = await db
      .insert(products)
      .values(payload)
      .returning({
        id: products.id
      })

    return await this.get(newProduct.id, user)
  }

  static async update(id: number, payload: ProductRequest, user: User): Promise<Product> {
    await BranchService.check(payload.branchId, user)
    const conditions = [
      eq(products.id, id),
      isNull(products.deletedAt),
    ]

    if (user.role === RoleEnum.Admin) {
      conditions.push(eq(products.branchId, user.branchId))
    }

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

  static async delete(id: number, user: User): Promise<void> {
    const product = await this.get(id, user)
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

  static async check(id: number, user: User) {
    const conditions: ReturnType<typeof and>[] = [
      eq(products.id, id),
      isNull(products.deletedAt)
    ]

    if (user.role !== RoleEnum.SuperAdmin) {
      conditions.push(eq(products.branchId, user.branchId))
    }

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
  }

  private static async count(query?: SQL<unknown>): Promise<number> {
    const [item] = await db
      .select({ count: count().mapWith(Number) })
      .from(products)
      .where(query)

    return item.count
  }

  private static buildWhereClause(query: ProductFilter, user: User) {
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
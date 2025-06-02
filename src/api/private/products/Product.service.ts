import { messages } from '@/utils/constants/locales/messages';
import { BadRequestException } from '@/utils/exceptions/BadRequestException';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';
import { countOffset } from '@/utils/helpers/count-offset';
import { db } from 'db';
import { products } from 'db/schema/products';
import { and, asc, count, desc, eq, isNull, like, SQL } from 'drizzle-orm';
import { productColumns } from './Product.column';
import { Product, ProductColumn, ProductFilter, ProductListColumn, ProductRequest, sortableProductColumn } from './Product.schema';
import { AppDate } from '@/utils/libs/AppDate';

export abstract class ProductService {
  static async list(query: ProductFilter): Promise<[Product[], number]> {
    let orders: SQL<unknown>[] = [];

    const pushOrders = (
      cols: string | string[] | undefined,
      direction: 'asc' | 'desc'
    ) => {
      const targetCols = Array.isArray(cols) ? cols : [cols];
      const isAsc = direction === 'asc';
      const opposite = isAsc ? 'desc' : 'asc';

      targetCols.forEach((col) => {
        if (!sortableProductColumn.includes(col as ProductListColumn)) return;
        if ((query[opposite] as ProductListColumn[]).includes(col as ProductListColumn)) return;

        const orderFn = isAsc ? asc : desc;
        orders.push(orderFn(products[col as ProductColumn]));
      });
    };

    pushOrders(query.asc, 'asc');
    pushOrders(query.desc, 'desc');

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
        .orderBy(...orders)
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
      throw new BadRequestException(messages.errorConstraint('Product'))
    }

    return product
  }
}
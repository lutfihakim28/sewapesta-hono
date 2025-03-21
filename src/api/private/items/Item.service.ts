import { db } from 'db';
import { SQL, count, and, isNull, eq, like, gte, lte, asc, desc, sql, notInArray } from 'drizzle-orm';
import { ItemColumn, ItemExtended, ItemFilter, ItemRequest, ProductItemColumn, ProductItemSchema } from './Item.schema';
import { items } from 'db/schema/items';
import { User } from '../users/User.schema';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { branches } from 'db/schema/branches';
import { productsItems } from 'db/schema/productsItems';
import { SortEnum } from '@/lib/enums/SortEnum';
import { countOffset } from '@/lib/utils/countOffset';
import { users } from 'db/schema/users';
import { products } from 'db/schema/products';
import { images } from 'db/schema/images';
import { ImageReferenceEnum } from '@/lib/enums/ImageReference.Enum';
import { profiles } from 'db/schema/profiles';
import { itemColumns } from './Item.column';
import { profileColumns } from '../users/User.column';
import { Image, ImageSchema } from '../images/Image.schema';
import { buildJsonGroupArray } from '@/lib/utils/buildJsonGroupArray';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { messages } from '@/lib/constants/messages';
import { ImageService } from '../images/Image.service';
import { CategoryService } from '../categories/Category.service';
import { UnitService } from '../units/Unit.service';
import { UserService } from '../users/User.service';
import { ProductService } from '../products/Product.service';
import { ItemListRoute } from './Item.routes';
import dayjs from 'dayjs';

export abstract class ItemService {
  static async list(user: User, query: ItemFilter): Promise<[ItemExtended[], number]> {
    const { ownerId, ...selectedColumns } = itemColumns
    let sort: SortEnum = SortEnum.Ascending;
    let sortBy: ItemColumn | ProductItemColumn = 'id';

    if (query.sort) {
      sort = query.sort
    }

    if (query.sortBy) {
      sortBy = query.sortBy
    }

    let orderBy: SQL<unknown>

    if ([
      "id", "name", "createdAt", "updatedAt", "deletedAt",
      "categoryId", "ownerId", "quantity", "price", "unitId"
    ].includes(sortBy as ItemColumn)) {
      orderBy = sort === SortEnum.Ascending
        ? asc(items[sortBy as ItemColumn])
        : desc(items[sortBy as ItemColumn])
    } else {
      orderBy = sort === SortEnum.Ascending
        ? asc(productsItems[sortBy as ProductItemColumn])
        : desc(productsItems[sortBy as ProductItemColumn])
    }

    const where = this.buildWhereClause(user, query);

    const [_items, totalData] = await Promise.all([
      db.select({
        ...selectedColumns,
        owner: profileColumns,
        products: buildJsonGroupArray([
          productsItems.productId,
          productsItems.overtimeMultiplier,
          productsItems.overtimePrice,
          productsItems.overtimeRatio,
          productsItems.overtimeType,
        ]),
        images: buildJsonGroupArray([
          images.id,
          images.path,
          images.url,
        ]),
      })
        .from(items)
        .leftJoin(productsItems, eq(productsItems.itemId, items.id))
        .innerJoin(products, eq(products.id, productsItems.productId))
        .innerJoin(users, eq(users.id, items.ownerId))
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .innerJoin(branches, eq(branches.id, users.branchId))
        .leftJoin(
          images,
          and(eq(images.reference, ImageReferenceEnum.ITEM), eq(images.referenceId, items.id)),
        )
        .where(where)
        .orderBy(orderBy)
        .groupBy(items.id)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      this.count(where)
    ])

    return [
      _items.map((item) => ({
        ...item,
        products: (JSON.parse(item.products) as unknown[]).map((product) => ProductItemSchema.parse(product)),
        images: (JSON.parse(item.images) as unknown[]).filter((image) => (image as Image).id).map((image) => ImageSchema.parse(image)),
      })),
      totalData
    ]
  }

  static async get(id: number, user?: User): Promise<ItemExtended> {
    const { ownerId, ...selectedColumns } = itemColumns

    const conditions = [
      eq(items.id, id),
      isNull(items.deletedAt),
    ]

    if (user && user?.role !== RoleEnum.SuperAdmin) {
      conditions.push(eq(branches.id, user.branchId))
    }

    const [item] = await db
      .select({
        ...selectedColumns,
        owner: profileColumns,
        products: buildJsonGroupArray([
          productsItems.productId,
          productsItems.overtimeMultiplier,
          productsItems.overtimePrice,
          productsItems.overtimeRatio,
          productsItems.overtimeType,
        ]),
        images: buildJsonGroupArray([
          images.id,
          images.path,
          images.url,
        ]),
      })
      .from(items)
      .leftJoin(productsItems, eq(productsItems.itemId, items.id))
      .innerJoin(products, eq(products.id, productsItems.productId))
      .innerJoin(users, eq(users.id, items.ownerId))
      .innerJoin(profiles, eq(profiles.userId, users.id))
      .innerJoin(branches, eq(branches.id, users.branchId))
      .leftJoin(
        images,
        and(eq(images.reference, ImageReferenceEnum.ITEM), eq(images.referenceId, items.id)),
      )
      .where(and(...conditions))
      .groupBy(items.id)
      .limit(1)

    if (!item) {
      throw new NotFoundException(messages.errorNotFound(`Item with ID ${id}`));
    }

    return {
      ...item,
      products: (JSON.parse(item.products) as unknown[]).map((product) => ProductItemSchema.parse(product)),
      images: (JSON.parse(item.images) as unknown[]).filter((image) => (image as Image).id).map((image) => ImageSchema.parse(image)),
    }
  }

  static async create(payload: ItemRequest): Promise<ItemExtended> {
    const { products: productsData, images: imagesData, ...itemsData } = payload

    const itemId = await db.transaction(async (transaction) => {
      const [item] = await transaction
        .insert(items)
        .values(itemsData)
        .returning({
          id: itemColumns.id
        })

      await Promise.all([
        ImageService.save(transaction, imagesData.filter((image) => typeof image === 'string'), {
          reference: ImageReferenceEnum.ITEM,
          referenceId: item.id
        }),
        transaction.insert(productsItems)
          .values(productsData
            .filter((product) => typeof product !== 'number')
            .map((product) => ({
              ...product,
              itemId: item.id
            }))
          )
      ])

      return item.id
    })

    return await this.get(itemId)
  }

  static async update(id: number, payload: ItemRequest): Promise<ItemExtended> {
    const { products: productsData, images: imagesData, ...itemsData } = payload

    await db.transaction(async (transaction) => {
      await transaction
        .update(items)
        .set(itemsData)
        .where(and(
          eq(items.id, id),
          isNull(items.deletedAt)
        ))

      await Promise.all([
        transaction.delete(productsItems)
          .where(notInArray(productsItems.productId, productsData.filter((product) => typeof product === 'number'))),
        ImageService.delete(transaction, imagesData.filter((image) => typeof image === 'number')),
        ImageService.save(transaction, imagesData.filter((image) => typeof image === 'string'), {
          reference: ImageReferenceEnum.ITEM,
          referenceId: id
        }),
        transaction.insert(productsItems)
          .values(productsData
            .filter((product) => typeof product !== 'number')
            .map((product) => ({
              ...product,
              itemId: id
            }))
          )
      ])
    })

    const item = await this.get(id)

    return item
  }

  static async delete(id: number) {
    const item = await db
      .update(items)
      .set({
        deletedAt: dayjs().unix(),
      })
      .where(and(
        eq(items.id, id),
        isNull(items.deletedAt)
      ))
      .returning({ id: items.id })

    if (!item) {
      throw new NotFoundException(messages.errorNotFound(`Item with ID ${id}`))
    }
  }

  private static async count(query?: SQL<unknown>) {
    const [item] = await db
      .select({ count: count().mapWith(Number) })
      .from(items)
      .where(query)

    return item?.count || 0
  }

  private static buildWhereClause(user: User, query: ItemFilter) {
    const conditions: ReturnType<typeof and>[] = [
      isNull(items.deletedAt),
    ]

    if (user.role !== RoleEnum.SuperAdmin) {
      conditions.push(
        eq(branches.id, user.branchId)
      )
    } else if (query.branchId) {
      conditions.push(
        eq(branches.id, query.branchId)
      )
    }

    if (query.categoryId) {
      conditions.push(eq(items.categoryId, query.categoryId))
    }

    if (query.overtimeType) {
      conditions.push(eq(productsItems.overtimeType, query.overtimeType))
    }

    if (query.ownerId) {
      conditions.push(eq(items.ownerId, query.ownerId))
    }

    if (query.productId) {
      conditions.push(eq(productsItems.productId, query.productId))
    }

    if (query.minPrice) {
      conditions.push(gte(items.price, query.minPrice))
    }

    if (query.maxPrice) {
      conditions.push(lte(items.price, query.maxPrice))
    }

    if (query.keyword) {
      conditions.push(
        like(items.name, `%${query.keyword}%`),
      );
    }

    return and(...conditions)
  }
}
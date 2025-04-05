import { messages } from '@/lib/constants/messages';
import { ImageReferenceEnum } from '@/lib/enums/ImageReference.Enum';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { SortEnum } from '@/lib/enums/SortEnum';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { buildJsonGroupArray } from '@/lib/utils/build-json-group-array';
import { countOffset } from '@/lib/utils/count-offset';
import { db } from 'db';
import { branches } from 'db/schema/branches';
import { images } from 'db/schema/images';
import { items } from 'db/schema/items';
import { products } from 'db/schema/products';
import { productsItems } from 'db/schema/products-items';
import { profiles } from 'db/schema/profiles';
import { users } from 'db/schema/users';
import { and, asc, count, countDistinct, desc, eq, gte, inArray, isNull, like, lte, not, notInArray, sql, SQL } from 'drizzle-orm';
import { CategoryService } from '../categories/Category.service';
import { Image, ImageSchema } from '../images/Image.schema';
import { ImageService } from '../images/Image.service';
import { ProductService } from '../products/Product.service';
import { UnitService } from '../units/Unit.service';
import { profileColumns } from '../users/User.column';
import { User } from '../users/User.schema';
import { UserService } from '../users/User.service';
import { itemColumns } from './Item.column';
import { ItemColumn, ItemExtended, ItemFilter, ItemList, ItemRequest, ItemSort, ProductItemColumn, ProductItemSchema } from './Item.schema';
import { itemQuantityQuery } from './Item.query';
import { itemMutations } from 'db/schema/item-mutations';
import { ItemMutationTypeEnum } from '@/lib/enums/ItemMutationType.Enum';
import { ItemMutationDescriptionEnum } from '@/lib/enums/ItemMutationDescriptionEnum';
import dayjs from 'dayjs';
import { categories } from 'db/schema/categories';
import { units } from 'db/schema/units';
import { itemsOwners } from 'db/schema/items-owners';

export abstract class ItemService {
  static async list(query: ItemFilter, user: User): Promise<[ItemList[], number]> {
    const { unitId, categoryId, ...selectedColumns } = itemColumns
    let sort: SortEnum = SortEnum.Ascending;
    let sortBy: ItemSort = 'id';

    if (query.sort) {
      sort = query.sort
    }

    if (query.sortBy) {
      sortBy = query.sortBy
    }

    let orderBy: SQL<unknown>

    if (['id', 'name'].includes(sortBy as ItemColumn)) {
      orderBy = sort === SortEnum.Ascending
        ? asc(items[sortBy as ItemColumn])
        : desc(items[sortBy as ItemColumn])
    } else {
      // orderBy = sort === SortEnum.Ascending
      //   ? asc(productsItems[sortBy as ProductItemColumn])
      //   : desc(productsItems[sortBy as ProductItemColumn])
    }

    const [_items] = await Promise.all([
      db.with(itemQuantityQuery)
        .select({
          ...selectedColumns,
          // owner: profileColumns,
          // products: buildJsonGroupArray([
          //   productsItems.productId,
          //   productsItems.overtimeMultiplier,
          //   productsItems.overtimePrice,
          //   productsItems.overtimeRatio,
          //   productsItems.overtimeType,
          // ]),
          images: buildJsonGroupArray([
            images.id,
            images.path,
            images.url,
          ]),
          // quantity: itemQuantityQuery.quantity,
          unit: units.name,
          category: categories.name,
          ownedBy: count(itemsOwners.id),
          availableQuantity: itemQuantityQuery.availableQuantity,
          totalQuantity: sql<number>`SUM(${itemsOwners.quantity})`.mapWith(Number).as('totalQuantity'),
        })
        .from(items)
        .innerJoin(categories, eq(categories.id, items.categoryId))
        .innerJoin(units, eq(units.id, items.unitId))
        .leftJoin(itemsOwners, eq(itemsOwners.itemId, items.id))
        .leftJoin(itemQuantityQuery, eq(itemQuantityQuery.itemId, items.id))
        .leftJoin(
          images,
          and(eq(images.reference, ImageReferenceEnum.ITEM), eq(images.referenceId, items.id)),
        )
        // .where(this.buildWhereClause(user, query))
        // .orderBy(orderBy)
        .groupBy(items.id),
      // .limit(Number(query.pageSize || 5))
      // .offset(countOffset(query.page, query.pageSize)),
      // this.count(this.buildWhereClause(user, query))
    ])

    return [
      _items.map((item) => ({
        ...item,
        // products: (JSON.parse(item.products) as unknown[]).map((product) => ProductItemSchema.parse(product)),
        images: (JSON.parse(item.images) as unknown[]).filter((image) => (image as Image).id).map((image) => ImageSchema.parse(image)),
      })),
      10
    ]
  }

  static async get(id: number, user: User): Promise<ItemExtended> {
    const { ownerId, ...selectedColumns } = itemColumns

    const conditions = [
      eq(items.id, id),
      isNull(items.deletedAt),
    ]

    if (user && user?.role !== RoleEnum.SuperAdmin) {
      conditions.push(eq(branches.id, user.branchId))
    }

    const [item] = await db
      .with(itemQuantityQuery)
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
        quantity: itemQuantityQuery.quantity,
      })
      .from(items)
      .leftJoin(productsItems, eq(productsItems.itemId, items.id))
      .innerJoin(products, eq(products.id, productsItems.productId))
      .innerJoin(users, eq(users.id, items.ownerId))
      .innerJoin(profiles, eq(profiles.userId, users.id))
      .innerJoin(branches, eq(branches.id, users.branchId))
      .leftJoin(itemQuantityQuery, eq(itemQuantityQuery.itemId, items.id))
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

  static async create(payload: ItemRequest, user: User): Promise<ItemExtended> {
    await this.checkConstraint(payload, user)
    const { products: productsData, images: imagesData, ...itemsData } = payload

    const itemId = await db.transaction(async (transaction) => {
      const [item] = await transaction
        .insert(items)
        .values(itemsData)
        .returning({
          id: itemColumns.id
        })

      await ImageService.save(transaction, imagesData.filter((image) => typeof image === 'string'), {
        reference: ImageReferenceEnum.ITEM,
        referenceId: item.id
      })
      await transaction.insert(productsItems)
        .values(productsData
          .filter((product) => typeof product !== 'number')
          .map((product) => ({
            ...product,
            itemId: item.id
          }))
        )

      await transaction.insert(itemMutations)
        .values({
          itemId: item.id,
          quantity: payload.quantity || 0,
          description: ItemMutationDescriptionEnum.ItemCreation,
          type: ItemMutationTypeEnum.Adjustment
        })

      return item.id
    })

    return await this.get(itemId, user)
  }

  static async update(id: number, payload: ItemRequest, user: User): Promise<ItemExtended> {
    await this.checkConstraint(payload, user)
    const { products: productsData, images: imagesData, ...itemsData } = payload

    await db.transaction(async (transaction) => {
      await transaction
        .update(items)
        .set(itemsData)
        .where(and(
          eq(items.id, id),
          isNull(items.deletedAt)
        ))

      await transaction.delete(productsItems)
        .where(notInArray(productsItems.productId, productsData.filter((product) => typeof product === 'number')))
      await ImageService.delete(transaction, imagesData.filter((image) => typeof image === 'number'))
      await ImageService.save(transaction, imagesData.filter((image) => typeof image === 'string'), {
        reference: ImageReferenceEnum.ITEM,
        referenceId: id
      })
      await transaction.insert(productsItems)
        .values(productsData
          .filter((product) => typeof product !== 'number')
          .map((product) => ({
            ...product,
            itemId: id
          }))
        )
    })

    return await this.get(id, user)
  }

  static async delete(id: number) {
    const [item] = await db
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

  static async check(id: number, user: User) {
    const conditions = [
      isNull(items.deletedAt),
      eq(items.id, id),
      not(eq(users.role, RoleEnum.SuperAdmin))
    ]

    if (user.role !== RoleEnum.SuperAdmin) {
      conditions.push(eq(users.branchId, user.branchId))
    }

    const [item] = await db.select()
      .from(items)
      .innerJoin(users, eq(users.id, items.ownerId))
      .where(and(...conditions))
      .limit(1)

    if (!item) {
      throw new NotFoundException(messages.errorNotFound(`Item with ID ${id}`))
    }
  }

  private static async count(query?: SQL<unknown>) {
    // const [item] = await db
    //   .select({ count: countDistinct(items.id).mapWith(Number) })
    //   .from(items)
    //   .innerJoin(users, eq(users.id, items.ownerId))
    //   .innerJoin(branches, eq(branches.id, users.branchId))
    //   .where(query)

    // return item?.count || 0
    return 10
  }

  private static buildWhereClause(user: User, query: ItemFilter) {
    const conditions: ReturnType<typeof and>[] = [
      isNull(items.deletedAt),
    ]

    if (query.categoryId) {
      conditions.push(eq(items.categoryId, +query.categoryId))
    }

    if (query.minPrice) {
      conditions.push(gte(items.price, +query.minPrice))
    }

    if (query.maxPrice) {
      conditions.push(lte(items.price, +query.maxPrice))
    }

    if (query.keyword) {
      conditions.push(
        like(items.name, `%${query.keyword}%`),
      );
    }

    if (user.role === RoleEnum.Owner) {
      conditions.push(eq(items.ownerId, user.id))
    } else if (query.ownerId) {
      conditions.push(eq(items.ownerId, +query.ownerId))
    }

    if (user.role !== RoleEnum.SuperAdmin) {
      conditions.push(eq(
        branches.id,
        user.branchId
      ))
    } else if (query.branchId) {
      conditions.push(eq(
        branches.id,
        +query.branchId
      ))
    }

    if (query.overtimeType) {
      conditions.push(eq(productsItems.overtimeType, query.overtimeType))
    }

    if (query.productId) {
      conditions.push(eq(productsItems.productId, +query.productId))
    }

    return and(...conditions)
  }

  private static async checkConstraint(payload: ItemRequest, user: User) {
    const productsConstraint = payload
      .products
      .filter((product) => typeof product !== 'number')
      .map((product) => ProductService.check(product.productId, user))
    await Promise.all([
      UnitService.check(payload.unitId),
      CategoryService.check(payload.categoryId),
      UserService.check(payload.ownerId, user),
      ...productsConstraint,
    ])
  }
}
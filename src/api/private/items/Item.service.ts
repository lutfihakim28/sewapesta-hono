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
import { and, asc, count, countDistinct, desc, eq, getTableColumns, gte, inArray, isNull, like, lte, not, notInArray, or, sql, SQL } from 'drizzle-orm';
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
import { quantityQuery } from './Item.query';
import { itemMutations } from 'db/schema/item-mutations';
import { ItemMutationTypeEnum } from '@/lib/enums/ItemMutationType.Enum';
import { ItemMutationDescriptionEnum } from '@/lib/enums/ItemMutationDescriptionEnum';
import dayjs from 'dayjs';
import { categories } from 'db/schema/categories';
import { units } from 'db/schema/units';
import { itemsOwners } from 'db/schema/items-owners';
import { logger } from '@/lib/utils/logger';

export abstract class ItemService {
  static async list(query: ItemFilter, user: User): Promise<[ItemList[], number]> {
    const latestAdjustment = db.$with('latest_adjustment').as(
      db.select({
        itemOwnerId: itemMutations.itemOwnerId,
        time: sql<number>`MAX(${itemMutations.createdAt})`.mapWith(Number).as('time')
      })
        .from(itemMutations)
        .where(eq(itemMutations.type, ItemMutationTypeEnum.Adjustment))
        .groupBy(itemMutations.itemOwnerId)
    )

    const latestMutations = db.$with('latest_mutation').as(
      db
        .select(getTableColumns(itemMutations))
        .from(itemMutations)
        .leftJoin(latestAdjustment, eq(latestAdjustment.itemOwnerId, itemMutations.itemOwnerId))
        .where(or(
          isNull(latestAdjustment.time),
          gte(itemMutations.createdAt, latestAdjustment.time)
        ))
    )

    // TODO: HANDLE FILTER BY OWNER
    const availableQuantity = db.$with('available_quantity').as(
      db
        .select({
          ownerId: itemsOwners.ownerId,
          itemId: itemsOwners.itemId,
          value: sql<number>`SUM(
          CASE ${latestMutations.type}
            WHEN ${ItemMutationTypeEnum.Adjustment} THEN ${latestMutations.quantity}
            WHEN ${ItemMutationTypeEnum.Addition} THEN ${latestMutations.quantity}
            WHEN ${ItemMutationTypeEnum.Reduction} THEN -${latestMutations.quantity}
            ELSE 0
          END
        )`.mapWith(Number).as('available_quantity')
        })
        .from(itemsOwners)
        .leftJoin(latestMutations, eq(latestMutations.itemOwnerId, itemsOwners.id))
        .groupBy(itemsOwners.itemId, itemsOwners.ownerId)
    )

    // TODO: HANDLE FILTER BY OWNER
    const totalQuantity = db.$with('total_quantity').as(
      db.select({
        itemId: itemsOwners.itemId,
        value: sql<number>`SUM(${itemsOwners.quantity})`.mapWith(Number).as('total_quantity')
      })
        .from(itemsOwners)
        .groupBy(itemsOwners.itemId)
    )

    const itemQuantityQuery = db.$with('quantity_query').as(
      db
        .select({
          itemId: availableQuantity.itemId,
          availableQuantity: sql<number>`SUM(${availableQuantity.value})`.mapWith(Number).as('item_available_quantity'),
          totalQuantity: totalQuantity.value,
          ownedBy: countDistinct(availableQuantity.ownerId).as('owned_by')
        })
        .from(availableQuantity)
        .innerJoin(totalQuantity, eq(totalQuantity.itemId, availableQuantity.itemId))
        .groupBy(availableQuantity.itemId)
    )

    const { unitId, categoryId, ...selectedColumns } = itemColumns
    let sort: SortEnum = query.sort || SortEnum.Ascending;
    let sortBy: ItemSort = query.sortBy || 'id';

    let orderBy: SQL<unknown>;

    if (sortBy === 'availableQuantity' || sortBy === 'totalQuantity' || sortBy === 'ownedBy') {
      orderBy = sort === SortEnum.Ascending
        ? asc(itemQuantityQuery[sortBy])
        : desc(itemQuantityQuery[sortBy])
    } else {
      orderBy = sort === SortEnum.Ascending
        ? asc(items[sortBy as ItemColumn])
        : desc(items[sortBy as ItemColumn])
    }

    const conditions = [
      isNull(items.deletedAt)
    ]

    if (query.categoryId) {
      conditions.push(eq(items.categoryId, +query.categoryId))
    }

    if (query.keyword) {
      conditions.push(
        like(items.name, `%${query.keyword}%`),
      );
    }

    if (query.productId) {
      const _conditions = [
        eq(products.id, +query.productId),
        isNull(products.deletedAt)
      ]

      if (user.role !== RoleEnum.SuperAdmin) {
        _conditions.push(eq(
          products.branchId,
          user.branchId
        ))
      } else if (query.branchId) {
        _conditions.push(eq(
          products.branchId,
          +query.branchId
        ))
      }

      conditions.push(inArray(
        items.id,
        db.select({
          itemId: productsItems.itemId
        })
          .from(productsItems)
          .innerJoin(products, eq(products.id, productsItems.productId))
          .where(and(..._conditions))
      ))
    }

    const [_items, [itemCount]] = await Promise.all([
      db.with(latestAdjustment, latestMutations, availableQuantity, totalQuantity, itemQuantityQuery)
        .select({
          ...selectedColumns,
          unit: units.name,
          category: categories.name,
          ownedBy: sql<number>`COALESCE(${itemQuantityQuery.ownedBy}, 0)`,
          availableQuantity: sql<number>`COALESCE(${itemQuantityQuery.availableQuantity}, 0)`,
          totalQuantity: sql<number>`COALESCE(${itemQuantityQuery.totalQuantity}, 0)`,
        })
        .from(items)
        .innerJoin(categories, eq(categories.id, items.categoryId))
        .innerJoin(units, eq(units.id, items.unitId))
        .leftJoin(itemQuantityQuery, eq(itemQuantityQuery.itemId, items.id))
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      db.with(latestAdjustment, latestMutations, availableQuantity, totalQuantity, itemQuantityQuery)
        .select({ value: count(items.id) })
        .from(items)
        .innerJoin(categories, eq(categories.id, items.categoryId))
        .innerJoin(units, eq(units.id, items.unitId))
        .leftJoin(itemQuantityQuery, eq(itemQuantityQuery.itemId, items.id))
        .where(and(...conditions))
    ])

    logger.debug(_items, 'ItemResult')

    return [
      _items,
      itemCount.value
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
      .with(quantityQuery)
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
        quantity: quantityQuery.quantity,
      })
      .from(items)
      .leftJoin(productsItems, eq(productsItems.itemId, items.id))
      .innerJoin(products, eq(products.id, productsItems.productId))
      .innerJoin(users, eq(users.id, items.ownerId))
      .innerJoin(profiles, eq(profiles.userId, users.id))
      .innerJoin(branches, eq(branches.id, users.branchId))
      .leftJoin(quantityQuery, eq(quantityQuery.itemId, items.id))
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
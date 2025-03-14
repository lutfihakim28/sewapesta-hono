import { db } from 'db';
import { SQL, count, and, isNull, eq, like, or, gte, lte, asc, desc, getTableColumns } from 'drizzle-orm';
import { ItemColumn, ItemExtended, ItemFilter, ProductItemColumn } from './Item.schema';
import { itemCategoryIndex, itemOwnerIndex, items } from 'db/schema/items';
import { User } from '../users/User.schema';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { branches } from 'db/schema/branches';
import { productsItems } from 'db/schema/productsItems';
import { SortEnum } from '@/lib/enums/SortEnum';
import { countOffset } from '@/lib/utils/countOffset';
import { userBranchIndex, users } from 'db/schema/users';
import { products } from 'db/schema/products';
import { imageReferenceIdIndex, imageReferenceIndex, images } from 'db/schema/images';
import { ImageReferenceEnum } from '@/lib/enums/ImageReference.Enum';
import { profiles } from 'db/schema/profiles';
import { locationQuery } from '@/api/public/locations/Location.query';
import { itemColumns } from './Item.column';
import { profileColumns } from '../users/User.column';

export abstract class ItemService {
  static async list(user: User, query: ItemFilter): Promise<ItemExtended> {
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

    const result = await Promise.all([
      db.select({
        ...selectedColumns,
        owner: {
          id: users.id,
        }
      })
        .from(items, { useIndex: [itemCategoryIndex, itemOwnerIndex] })
        .innerJoin(productsItems, eq(productsItems.itemId, items.id))
        .innerJoin(products, eq(products.id, productsItems.productId))
        .innerJoin(users, eq(users.id, items.ownerId), { useIndex: [userBranchIndex] })
        .innerJoin(profiles, eq(profiles.id, users.profileId))
        .leftJoin(locationQuery, eq(locationQuery.subdistrictCode, profiles.subdistrictCode))
        .innerJoin(branches, eq(branches.id, users.branchId))
        .leftJoin(
          images,
          and(eq(images.reference, ImageReferenceEnum.ITEM), eq(images.referenceId, items.id)),
          { useIndex: [imageReferenceIdIndex, imageReferenceIndex] }
        )
        .where(where)
        .orderBy(orderBy)
        .limit(Number(query.pageSize || 5))
        .offset(countOffset(query.page, query.pageSize)),
      this.count(where)
    ])

    // TODO
    return result
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
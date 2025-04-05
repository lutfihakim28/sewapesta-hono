import { ItemMutationTypeEnum } from '@/lib/enums/ItemMutationType.Enum';
import { db } from 'db';
import { itemMutations } from 'db/schema/item-mutations';
import { items } from 'db/schema/items';
import { itemsOwners } from 'db/schema/items-owners';
import { and, eq, gte, isNull, max, sql } from 'drizzle-orm';

export const itemQuantityQuery = db.$with('itemQuantityQuery').as(
  db.select({
    itemId: itemsOwners.itemId,
    availableQuantity: sql<number>`
          SUM(CASE WHEN ${itemMutations.type} = ${ItemMutationTypeEnum.Adjustment} THEN ${itemMutations.quantity} ELSE 0 END) 
          + SUM(CASE WHEN ${itemMutations.type} = ${ItemMutationTypeEnum.Addition} THEN ${itemMutations.quantity} ELSE 0 END) 
          - SUM(CASE WHEN ${itemMutations.type} = ${ItemMutationTypeEnum.Reduction} THEN ${itemMutations.quantity} ELSE 0 END)
        `.mapWith(Number).as('availableQuantity')
  })
    .from(itemsOwners)
    .leftJoin(
      itemMutations,
      and(
        eq(itemsOwners.id, itemMutations.itemOwnerId),
        isNull(itemMutations.deletedAt),
        gte(
          itemMutations.createdAt,
          db.select({
            value: max(itemMutations.createdAt)
          })
            .from(itemMutations)
            .where(and(
              eq(itemMutations.itemOwnerId, itemsOwners.id),
              eq(itemMutations.type, ItemMutationTypeEnum.Adjustment)
            )),
        )
      )
    )
    .groupBy(itemsOwners.itemId)
)

// export const itemQuantityQuery = db.$with('itemQuantityQuery').as(
//   db.select({
//     itemId: itemsOwners.itemId,
//     availableQuantity: sql<number>`
//           SUM(CASE WHEN ${itemMutations.type} = ${ItemMutationTypeEnum.Adjustment} THEN ${itemMutations.quantity} ELSE 0 END)
//           + SUM(CASE WHEN ${itemMutations.type} = ${ItemMutationTypeEnum.Addition} THEN ${itemMutations.quantity} ELSE 0 END)
//           - SUM(CASE WHEN ${itemMutations.type} = ${ItemMutationTypeEnum.Reduction} THEN ${itemMutations.quantity} ELSE 0 END)
//         `.mapWith(Number).as('availableQuantity'),
//     totalQuantity: sql<number>`
//       SUM(${itemsOwners.quantity})
//     `.mapWith(Number).as('totalQuantity')
//   })
//     .from(itemMutations)
//     .rightJoin(itemsOwners, and(itemMutations.deletedAt, eq(itemsOwners.id, itemMutations.itemOwnerId)))
//     .leftJoin(items, eq(items.id, itemsOwners.itemId))
//     .where(and(
//       gte(
//         itemMutations.createdAt,
//         db.select({
//           value: max(itemMutations.createdAt)
//         })
//           .from(itemMutations)
//           .where(and(
//             eq(itemsOwners.itemId, items.id),
//             eq(itemMutations.type, ItemMutationTypeEnum.Adjustment)
//           ))
//       )
//     ))
//     .groupBy(itemsOwners.itemId)
// )
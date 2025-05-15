// import { StockMutationTypeEnum } from '@/lib/enums/StockMutationType.Enum';
// import { db } from 'db';
// import { stockMutations } from 'db/schema/inventory-mutations';
// import { itemsOwners } from 'db/schema/items-owners';
// import { and, count, countDistinct, eq, getTableColumns, gte, inArray, isNull, max, or, sql } from 'drizzle-orm';
// import { User } from '../users/User.schema';
// import { RoleEnum } from '@/lib/enums/RoleEnum';
// import { users } from 'db/schema/users';

// export function quantityQuery(user: User, branchId?: string) {
//   const latestAdjustment = db.$with('latestAdjustment').as(
//     db.select({
//       itemOwnerId: stockMutations.itemOwnerId,
//       time: sql<number>`MAX(${stockMutations.createdAt})`.mapWith(Number).as('time')
//     })
//       .from(stockMutations)
//       .where(eq(stockMutations.type, StockMutationTypeEnum.Adjustment))
//       .groupBy(stockMutations.itemOwnerId)
//   )

//   const latestMutations = db.$with('latestMutations').as(
//     db.with(latestAdjustment)
//       .select(getTableColumns(stockMutations))
//       .from(stockMutations)
//       .leftJoin(latestAdjustment, eq(latestAdjustment.itemOwnerId, stockMutations.itemOwnerId))
//       .where(or(
//         isNull(latestAdjustment.time),
//         gte(stockMutations.createdAt, latestAdjustment.time)
//       ))
//   )

//   // TODO: HANDLE FILTER BY OWNER
//   const availableQuantity = db.$with('availableQuantity').as(
//     db.with(latestMutations)
//       .select({
//         ownerId: itemsOwners.ownerId,
//         itemId: itemsOwners.itemId,
//         value: sql<number>`SUM(
//           CASE ${latestMutations.type}
//             WHEN ${StockMutationTypeEnum.Adjustment} THEN ${latestMutations.quantity}
//             WHEN ${StockMutationTypeEnum.Addition} THEN ${latestMutations.quantity}
//             WHEN ${StockMutationTypeEnum.Reduction} THEN -${latestMutations.quantity}
//             ELSE 0
//           END
//         )`.mapWith(Number).as('availableQuantity')
//       })
//       .from(itemsOwners)
//       .leftJoin(latestMutations, eq(latestMutations.itemOwnerId, itemsOwners.id))
//       .groupBy(itemsOwners.itemId, itemsOwners.ownerId)
//   )

//   // TODO: HANDLE FILTER BY OWNER
//   const totalQuantity = db.$with('totalQuantity').as(
//     db.select({
//       itemId: itemsOwners.itemId,
//       value: sql<number>`SUM(${itemsOwners.quantity})`.mapWith(Number).as('totalQuantity')
//     })
//       .from(itemsOwners)
//       .groupBy(itemsOwners.itemId)
//   )

//   return db.$with('quantityQuery').as(
//     db.with(availableQuantity, totalQuantity)
//       .select({
//         itemId: availableQuantity.itemId,
//         ownerId: availableQuantity.ownerId,
//         availableQuantity: availableQuantity.value,
//         totalQuantity: totalQuantity.value,
//         ownedBy: countDistinct(availableQuantity.ownerId).as('ownedBy')
//       })
//       .from(availableQuantity)
//       .innerJoin(totalQuantity, eq(totalQuantity.itemId, availableQuantity.itemId))
//       .groupBy(availableQuantity.itemId)
//   )

//   // const conditions = [
//   //   isNull(itemsOwners.deletedAt)
//   // ]

//   // if (user.role === RoleEnum.Owner) {
//   //   conditions.push(eq(itemsOwners.ownerId, user.id))
//   // }

//   // if (user.role === RoleEnum.Admin) {
//   //   conditions.push(inArray(
//   //     itemsOwners.ownerId,
//   //     db.select({ id: users.id })
//   //       .from(users)
//   //       .where(and(
//   //         isNull(users.deletedAt),
//   //         eq(users.branchId, user.branchId)
//   //       ))
//   //   ))
//   // }

//   // if (user.role === RoleEnum.SuperAdmin && !!branchId) {
//   //   conditions.push(inArray(
//   //     itemsOwners.ownerId,
//   //     db.select({ id: users.id })
//   //       .from(users)
//   //       .where(and(
//   //         isNull(users.deletedAt),
//   //         eq(users.branchId, +branchId)
//   //       ))
//   //   ))
//   // }

//   // const totalQuantity = db.selectDistinct({
//   //   value: sql<number>`SUM(${itemsOwners.quantity})`.as('totalQuantity')
//   // })
//   //   .from(itemsOwners)
//   //   .where(and(...conditions))
//   //   .as('totalQuantity')

//   // return db.$with('itemQuantityQuery').as(
//   //   db.select({
//   //     itemId: itemsOwners.itemId,
//   //     ownedBy: count(sql`DISTINCT ${itemsOwners.ownerId}`).as('ownedBy'),
//   //     availableQuantity: sql<number>`
//   //           SUM(CASE WHEN ${itemMutations.type} = ${ItemMutationTypeEnum.Adjustment} THEN ${itemMutations.quantity} ELSE 0 END)
//   //           + SUM(CASE WHEN ${itemMutations.type} = ${ItemMutationTypeEnum.Addition} THEN ${itemMutations.quantity} ELSE 0 END)
//   //           - SUM(CASE WHEN ${itemMutations.type} = ${ItemMutationTypeEnum.Reduction} THEN ${itemMutations.quantity} ELSE 0 END)
//   //         `.mapWith(Number).as('availableQuantity'),
//   //     totalQuantity: totalQuantity.value
//   //   })
//   //     .from(itemsOwners)
//   //     .leftJoin(
//   //       itemMutations,
//   //       and(
//   //         eq(itemsOwners.id, itemMutations.itemOwnerId),
//   //         isNull(itemMutations.deletedAt),
//   //         gte(
//   //           itemMutations.createdAt,
//   //           db.select({
//   //             value: max(itemMutations.createdAt)
//   //           })
//   //             .from(itemMutations)
//   //             .where(and(
//   //               eq(itemMutations.itemOwnerId, itemsOwners.id),
//   //               eq(itemMutations.type, ItemMutationTypeEnum.Adjustment)
//   //             )),
//   //         )
//   //       )
//   //     )
//   //     .where(and(...conditions))
//   //     .groupBy(itemsOwners.itemId)
//   // )
// }
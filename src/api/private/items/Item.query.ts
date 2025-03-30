import { ItemMutationTypeEnum } from '@/lib/enums/ItemMutationType.Enum';
import { db } from 'db';
import { itemMutations } from 'db/schema/item-mutations';
import { items } from 'db/schema/items';
import { and, eq, gte, isNull, max, sql } from 'drizzle-orm';

export const itemQuantityQuery = db.$with('itemQuantityQuery').as(
  db.select({
    itemId: itemMutations.itemId,
    quantity: sql<number>`
          SUM(CASE WHEN ${itemMutations.type} = ${ItemMutationTypeEnum.Adjustment} THEN ${itemMutations.quantity} ELSE 0 END) 
          + SUM(CASE WHEN ${itemMutations.type} = ${ItemMutationTypeEnum.Addition} THEN ${itemMutations.quantity} ELSE 0 END) 
          - SUM(CASE WHEN ${itemMutations.type} = ${ItemMutationTypeEnum.Reduction} THEN ${itemMutations.quantity} ELSE 0 END)
        `.mapWith(Number).as('quantity'),
  })
    .from(itemMutations)
    .leftJoin(items, eq(items.id, itemMutations.itemId))
    .where(and(
      isNull(itemMutations.deletedAt),
      gte(
        itemMutations.createdAt,
        db.select({
          value: max(itemMutations.createdAt)
        })
          .from(itemMutations)
          .where(and(
            eq(itemMutations.itemId, items.id),
            eq(itemMutations.type, ItemMutationTypeEnum.Adjustment)
          ))
      )
    ))
    .groupBy(itemMutations.itemId)
)
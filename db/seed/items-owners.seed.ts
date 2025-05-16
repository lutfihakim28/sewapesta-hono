import { StockMutationTypeEnum } from '@/utils/enums/StockMutationType.Enum';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import { db } from 'db';
import { stockMutations } from 'db/schema/inventory-mutations';
import { itemsOwners } from 'db/schema/items-owners';
import { StockMutationDefaultDescriptionEnum } from '@/utils/enums/StockMutationDefaultDescriptionEnum';

type ItemOwnerSeedProp = {
  ownersId: number[];
  itemsId: number[];
}

export async function seedItemOwner({ itemsId, ownersId }: ItemOwnerSeedProp) {
  console.log('Connecting item to its owner...')

  await db.transaction(async (transaction) => {
    for (const ownerId of ownersId) {
      const selectedItems = faker.helpers.uniqueArray(itemsId, faker.number.int({ min: 1, max: itemsId.length }))

      for (const itemId of selectedItems) {
        const quantity = faker.number.int({
          min: 100,
          max: 125,
        })
        const [itemOwner] = await transaction
          .insert(itemsOwners)
          .values({ itemId, ownerId })
          .returning({ id: itemsOwners.id })

        const startedDate = dayjs(faker.date.past());

        await transaction.insert(stockMutations).values([
          {
            quantity,
            type: StockMutationTypeEnum.Adjustment,
            createdAt: startedDate.unix(),
            description: StockMutationDefaultDescriptionEnum.Seeder,
            itemOwnerId: itemOwner.id,
            affectItemQuantity: true,
          },
          {
            quantity: faker.number.int({
              min: 20,
              max: 30,
            }),
            type: StockMutationTypeEnum.Addition,
            createdAt: startedDate.add(1, 'day').unix(),
            description: StockMutationDefaultDescriptionEnum.Seeder,
            itemOwnerId: itemOwner.id,
            affectItemQuantity: false,
          },
          {
            quantity: faker.number.int({
              min: 30,
              max: 70,
            }),
            type: StockMutationTypeEnum.Reduction,
            createdAt: startedDate.add(1, 'day').unix(),
            description: StockMutationDefaultDescriptionEnum.Seeder,
            itemOwnerId: itemOwner.id,
            affectItemQuantity: false,
          },
        ])
      }

    }
  })
}
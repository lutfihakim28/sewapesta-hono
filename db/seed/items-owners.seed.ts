import { ItemMutationTypeEnum } from '@/lib/enums/ItemMutationType.Enum';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import { db } from 'db';
import { itemMutations } from 'db/schema/item-mutations';
import { itemsOwners } from 'db/schema/items-owners';

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
          .values({ itemId, ownerId, quantity })
          .returning({ id: itemsOwners.id })

        const startedDate = dayjs(faker.date.past());

        await transaction.insert(itemMutations).values([
          {
            quantity,
            type: ItemMutationTypeEnum.Adjustment,
            createdAt: startedDate.unix(),
            description: 'SEEDER',
            itemOwnerId: itemOwner.id,
            affectItemQuantity: true,
          },
          {
            quantity: faker.number.int({
              min: 20,
              max: 30,
            }),
            type: ItemMutationTypeEnum.Addition,
            createdAt: startedDate.add(1, 'day').unix(),
            description: 'SEEDER',
            itemOwnerId: itemOwner.id,
            affectItemQuantity: false,
          },
          {
            quantity: faker.number.int({
              min: 30,
              max: 70,
            }),
            type: ItemMutationTypeEnum.Reduction,
            createdAt: startedDate.add(1, 'day').unix(),
            description: 'SEEDER',
            itemOwnerId: itemOwner.id,
            affectItemQuantity: false,
          },
        ])
      }

    }
  })
}
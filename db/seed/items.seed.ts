import { OvertimeTypeEnum } from '@/lib/enums/OvertimeTypeEnum';
import dayjs from 'dayjs';
import { productsItems } from 'db/schema/products-items';
import { db } from '..';
import { items } from 'db/schema/items';
import { faker } from '@faker-js/faker/locale/id_ID';
import { itemMutations } from 'db/schema/item-mutations';
import { ItemMutationTypeEnum } from '@/lib/enums/ItemMutationType.Enum';

type ItemSeedProp = {
  owner: number;
  categories: number[];
  units: number[];
  products: number[];
}

export async function seedItems({
  owner,
  units,
  products,
  categories,
}: ItemSeedProp) {
  console.log('Seeding items...');
  const [item] = await db
    .insert(items)
    .values({
      name: faker.commerce.product(),
      categoryId: faker.helpers.arrayElement(categories),
      price: faker.number.int({
        min: 100,
        max: 10000000,
      }),
      unitId: faker.helpers.arrayElement(units),
      ownerId: owner,
    })
    .returning({
      id: items.id,
      price: items.price,
    });

  await db.insert(itemMutations).values([
    {
      quantity: faker.number.int({
        min: 100,
        max: 125,
      }),
      itemId: item.id,
      type: ItemMutationTypeEnum.Adjustment,
      createdAt: dayjs(faker.date.past()).unix(),
      description: 'SEEDER'
    },
    {
      quantity: faker.number.int({
        min: 50,
        max: 100,
      }),
      itemId: item.id,
      type: ItemMutationTypeEnum.Addition,
      createdAt: dayjs(faker.date.past()).unix(),
      description: 'SEEDER'
    },
    {
      quantity: faker.number.int({
        min: 50,
        max: 100,
      }),
      itemId: item.id,
      type: ItemMutationTypeEnum.Reduction,
      createdAt: dayjs(faker.date.past()).unix(),
      description: 'SEEDER'
    },
    {
      quantity: faker.number.int({
        min: 100,
        max: 125,
      }),
      itemId: item.id,
      type: ItemMutationTypeEnum.Adjustment,
      createdAt: dayjs(faker.date.past()).unix(),
      description: 'SEEDER'
    },
    {
      quantity: faker.number.int({
        min: 50,
        max: 100,
      }),
      itemId: item.id,
      type: ItemMutationTypeEnum.Addition,
      createdAt: dayjs(faker.date.past()).unix(),
      description: 'SEEDER'
    },
    {
      quantity: faker.number.int({
        min: 50,
        max: 100,
      }),
      itemId: item.id,
      type: ItemMutationTypeEnum.Reduction,
      createdAt: dayjs(faker.date.past()).unix(),
      description: 'SEEDER'
    },
  ])

  await Promise.all(products.map(async (product) => {
    return db
      .insert(productsItems)
      .values({
        itemId: item.id,
        productId: product,
        overtimeType: faker.helpers.enumValue(OvertimeTypeEnum),
        overtimeMultiplier: (Math.round((faker.number.float({ min: 0, max: 0.3 }) + Number.EPSILON) * 100) / 100),
        overtimePrice: faker.number.int({ min: 0, max: Number(item.price) }),
        overtimeRatio: (Math.round((faker.number.float({ min: 0, max: 0.8 }) + Number.EPSILON) * 100) / 100),
      });
  }))
}
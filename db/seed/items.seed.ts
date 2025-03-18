import { OvertimeTypeEnum } from '@/lib/enums/OvertimeTypeEnum';
import dayjs from 'dayjs';
import { productsItems } from 'db/schema/productsItems';
import { db } from '..';
import { items } from 'db/schema/items';
import { faker } from '@faker-js/faker/locale/id_ID';

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
      name: faker.word.noun({
        length: {
          min: 3,
          max: 20,
        },
        strategy: 'any-length',
      }),
      categoryId: faker.helpers.arrayElement(categories),
      price: faker.number.int({
        min: 100,
        max: 10000000,
      }),
      unitId: faker.helpers.arrayElement(units),
      quantity: faker.number.int({
        min: 1,
        max: 125,
      }),
      ownerId: owner,
    })
    .returning({
      id: items.id,
      price: items.price,
    });

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
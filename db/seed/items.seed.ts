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
  const price = faker.number.int({
    min: 100,
    max: 10000000,
  }).toFixed(2)
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
      price,
      unitId: faker.helpers.arrayElement(units),
      quantity: faker.number.int({
        min: 1,
        max: 125,
      }),
      ownerId: owner,
    })
    .$returningId();

  await Promise.all(products.map(async (product) => {
    return db
      .insert(productsItems)
      .values({
        itemId: item.id,
        productId: product,
        overtimeType: faker.helpers.enumValue(OvertimeTypeEnum),
        overtimeMultiplier: (Math.round((faker.number.float({ min: 0, max: 0.3 }) + Number.EPSILON) * 100) / 100).toFixed(2),
        overtimePrice: faker.number.int({ min: 0, max: Number(price) }).toFixed(2),
        overtimeRatio: (Math.round((faker.number.float({ min: 0, max: 0.8 }) + Number.EPSILON) * 100) / 100).toFixed(2),
      });
  }))
}
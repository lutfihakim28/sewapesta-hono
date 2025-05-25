import { db } from '..';
import { items } from 'db/schema/items';
import { faker } from '@faker-js/faker/locale/id_ID';

type ItemSeedProp = {
  categoriesId: number[];
  unitsId: number[];
}

export async function seedItems({
  unitsId,
  categoriesId,
}: ItemSeedProp) {
  console.log('Seeding items...');
  const itemNames = faker.helpers.uniqueArray(faker.definitions.commerce.product_name.product, 100)
  return await db
    .insert(items)
    .values(itemNames.map((name) => ({
      name: name,
      categoryId: faker.helpers.arrayElement(categoriesId),
      unitId: faker.helpers.arrayElement(unitsId),
    })))
    .returning({
      id: items.id,
    });
}
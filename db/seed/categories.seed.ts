import { faker } from '@faker-js/faker';
import { db } from '..';
import { categories } from 'db/schema/categories';

export async function seedCategories(branchId: number) {
  console.log('Seeding categories...');
  const _categories = await db
    .insert(categories)
    .values(Array.from({ length: faker.number.int({ min: 1, max: 4 }) }).map(() => ({
      name: faker.word.noun(),
      branchId,
    })))
    .returning({
      id: categories.id
    });

  return _categories.map((category) => category.id);
}
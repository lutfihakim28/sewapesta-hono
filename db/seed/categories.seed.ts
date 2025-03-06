import { db } from '..';
import { categories } from 'db/schema/categories';

export async function seedCategories() {
  console.log('Seeding categories...');
  const _categories = await db
    .insert(categories)
    .values([
      {
        name: 'Tent',
      },
      {
        name: 'Sound',
      },
      {
        name: 'Light',
      },
      {
        name: 'Dining Equipment',
      },
      {
        name: 'Cooking Equipment',
      },
      {
        name: 'Power',
      },
      {
        name: 'Others',
      },
    ])
    .returning({
      id: categories.id
    });

  return _categories.map((category) => category.id);
}
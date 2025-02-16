import dayjs from 'dayjs';
import { db } from '..';
import { categories } from 'db/schema/categories';

export async function seedCategories() {
  console.log('Seeding categories...');
  const _categories = await db
    .insert(categories)
    .values([
      {
        name: 'Kain',
      },
      {
        name: 'Tenda',
      },
      {
        name: 'Lagan',
      },
      {
        name: 'Rigging',
      },
      {
        name: 'Sound',
      },
      {
        name: 'Lainnya',
      },
    ])
    .returning({
      id: categories.id
    });

  return _categories.map((category) => category.id);
}
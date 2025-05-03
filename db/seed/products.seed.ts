import { db } from 'db/index';
import { products } from 'db/schema/products';

export async function seedProducts() {
  console.log('Seeding products...');
  const _products = await db
    .insert(products)
    .values([
      {
        name: 'Wedding',
        rentalTimeIncrement: 24,
      },
      {
        name: 'Event',
        rentalTimeIncrement: 8,
      },
    ])
    .returning({
      id: products.id
    })

  return _products.map((product) => product.id)
}
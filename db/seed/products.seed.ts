import { db } from 'db/index';
import { products } from 'db/schema/products';

export async function seedProducts(branchId: number) {
  console.log('Seeding products...');
  const _products = await db
    .insert(products)
    .values([
      {
        name: 'Wedding',
        rentalTimeIncrement: 24,
        branchId,
      },
      {
        name: 'Event',
        rentalTimeIncrement: 8,
        branchId,
      },
    ])
    .returning({
      id: products.id
    })

  return _products.map((product) => product.id)
}
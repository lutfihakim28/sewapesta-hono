import dayjs from 'dayjs'
import { db } from '..'
import { faker } from '@faker-js/faker/locale/id_ID'
import { items } from 'db/schema/items'
import { products } from 'db/schema/products'
import { productItems } from 'db/schema/productItems'

export async function seedProducts() {
  console.log('Seeding products...')
  await db.transaction(async (transaction) => {
    const _items = await transaction.select({ id: items.id, name: items.name }).from(items)

    await Promise.all([
      ..._items.map(async (item) => {
        return await transaction.transaction(async (_transaction) => {
          const _product = await _transaction
            .insert(products)
            .values({
              name: item.name,
              createdAt: dayjs().unix(),
              overtimeRatio: faker.number.float({ min: 0, max: 0.3, fractionDigits: 1 }),
              price: faker.number.int({ min: 700, max: 2000 }) * 1000,
            })
            .returning({ id: products.id, price: products.price })

          await _transaction
            .insert(productItems)
            .values({
              itemId: item.id,
              productId: _product[0].id,
              price: _product[0].price,
            })
        })
      }),
      await transaction.transaction(async (_transaction) => {
        const price = faker.number.int({ min: 1000, max: 2000 }) * 1000;
        const _product = await _transaction
          .insert(products)
          .values({
            name: 'Event Besar',
            createdAt: dayjs().unix(),
            overtimeRatio: faker.number.float({ min: 0, max: 0.3, fractionDigits: 1 }),
            price,
          })
          .returning({ id: products.id, price: products.price })

        const itemPrice = faker.number.int({ min: 200, max: 900 }) * 1000;

        await _transaction
          .insert(productItems)
          .values([
            {
              itemId: 1,
              productId: _product[0].id,
              price: itemPrice,
            },
            {
              itemId: 5,
              productId: _product[0].id,
              price: price - itemPrice,
            }
          ])
      }),
      await transaction.transaction(async (_transaction) => {
        const price = faker.number.int({ min: 1000, max: 2000 }) * 1000;
        const _product = await _transaction
          .insert(products)
          .values({
            name: 'Event Sedang',
            createdAt: dayjs().unix(),
            overtimeRatio: faker.number.float({ min: 0, max: 0.3, fractionDigits: 1 }),
            price,
          })
          .returning({ id: products.id, price: products.price })

        const itemPrice = faker.number.int({ min: 200, max: 900 }) * 1000;

        await _transaction
          .insert(productItems)
          .values([
            {
              itemId: 1,
              productId: _product[0].id,
              price: itemPrice,
            },
            {
              itemId: 4,
              productId: _product[0].id,
              price: price - itemPrice,
            }
          ])
      }),
      await transaction.transaction(async (_transaction) => {
        const price = faker.number.int({ min: 1000, max: 2000 }) * 1000;
        const _product = await _transaction
          .insert(products)
          .values({
            name: 'Event Kecil',
            createdAt: dayjs().unix(),
            overtimeRatio: faker.number.float({ min: 0, max: 0.3, fractionDigits: 1 }),
            price,
          })
          .returning({ id: products.id, price: products.price })

        const itemPrice = faker.number.int({ min: 200, max: 900 }) * 1000;

        await _transaction
          .insert(productItems)
          .values([
            {
              itemId: 1,
              productId: _product[0].id,
              price: itemPrice,
            },
            {
              itemId: 3,
              productId: _product[0].id,
              price: price - itemPrice,
            }
          ])
      }),
      await transaction.transaction(async (_transaction) => {
        const price = faker.number.int({ min: 100, max: 2000 }) * 1000;
        const _product = await _transaction
          .insert(products)
          .values({
            name: 'Event Besar Sekali',
            createdAt: dayjs().unix(),
            overtimeRatio: faker.number.float({ min: 0, max: 0.3, fractionDigits: 1 }),
            price,
          })
          .returning({ id: products.id, price: products.price })

        const itemPrice = faker.number.int({ min: 500, max: 900 }) * 1000;
        const secondItemPrice = faker.number.int({ min: 100, max: 400 }) * 1000;

        await _transaction
          .insert(productItems)
          .values([
            {
              itemId: 1,
              productId: _product[0].id,
              price: itemPrice,
            },
            {
              itemId: 4,
              productId: _product[0].id,
              price: secondItemPrice,
            },
            {
              itemId: 5,
              productId: _product[0].id,
              price: price - itemPrice - secondItemPrice,
            },
          ])
      }),
      await transaction.transaction(async (_transaction) => {
        const price = faker.number.int({ min: 1000, max: 2000 }) * 1000;
        const _product = await _transaction
          .insert(products)
          .values({
            name: 'Event Hajatan',
            createdAt: dayjs().unix(),
            overtimeRatio: faker.number.float({ min: 0, max: 0.3, fractionDigits: 1 }),
            price,
          })
          .returning({ id: products.id, price: products.price })

        const itemPrice = faker.number.int({ min: 200, max: 900 }) * 1000;

        await _transaction
          .insert(productItems)
          .values([
            {
              itemId: 2,
              productId: _product[0].id,
              price: itemPrice,
            },
            {
              itemId: 3,
              productId: _product[0].id,
              price: price - itemPrice,
            }
          ])
      }),
    ])
  })
}
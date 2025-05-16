import { OvertimeTypeEnum } from '@/utils/enums/OvertimeTypeEnum'
import { faker } from '@faker-js/faker'
import { db } from 'db'
import { productsItems } from 'db/schema/products-items'

type ProductItemProp = {
  items: {
    id: number,
  }[]
  productsId: number[]
}

export async function seedProductItem({ items, productsId }: ProductItemProp) {
  console.log('Connecting product to its item...')

  await Promise.all(productsId.flatMap((productId) => {
    return items.map((item) => {
      const price = faker.number.int({
        min: 100,
        max: 10000000,
      })
      return db
        .insert(productsItems)
        .values({
          itemId: item.id,
          productId: productId,
          price,
          overtimeType: faker.helpers.enumValue(OvertimeTypeEnum),
          overtimeMultiplier: (Math.round((faker.number.float({ min: 0, max: 0.3 }) + Number.EPSILON) * 100) / 100),
          overtimePrice: faker.number.int({ min: 0, max: price }),
          overtimeRatio: (Math.round((faker.number.float({ min: 0, max: 0.8 }) + Number.EPSILON) * 100) / 100),
        })
    })
  }))
}
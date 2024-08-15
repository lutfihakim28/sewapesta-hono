import { OrderCreate } from '@/schemas/orders/OrderCreateSchema'
import { OrderService } from '@/services/OrderService'
import { faker } from '@faker-js/faker/locale/id_ID'
import dayjs from 'dayjs'

export async function seedOrders() {
  console.log('Seeding orders...')
  await recursiveCreate(0)
}

async function recursiveCreate(n: number) {
  if (n >= 10) {
    return;
  }

  const data: OrderCreate = {
    customerAddress: faker.location.streetAddress(),
    customerName: faker.person.fullName(),
    customerPhone: faker.phone.number(),
    note: faker.lorem.sentence(5),
    startDate: dayjs().add(faker.number.int({ min: 1, max: 2 }), 'day').unix(),
    endDate: dayjs().add(faker.number.int({ min: 2, max: 3 }), 'day').unix(),
    middleman: faker.datatype.boolean(),
    orderedProducts: new Array(faker.number.int({ min: 1, max: 3 })).fill(0).map(() => {
      return {
        baseQuantity: faker.number.int({ min: 1, max: 2 }),
        orderedQuantity: faker.number.int({ min: 1, max: 2 }),
        orderedUnitId: faker.number.int({ min: 1, max: 2 }),
        productId: faker.number.int({ min: 1, max: 10 }),
        price: faker.number.int({ min: 12, max: 50 }) * 100000,
        employees: new Array(faker.number.int({ min: 1, max: 3 })).fill(0).map(() => faker.number.int({
          min: 1,
          max: 28,
        })),
      }
    })
  }

  const result = await OrderService.create(data)
  console.log(`  ${result[0].number} created!`)
  await recursiveCreate(n + 1)
}
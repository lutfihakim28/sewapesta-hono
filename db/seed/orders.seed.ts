// import { OrderStatusEnum } from '@/lib/enums/OrderStatusEnum'
// import { OrderCreate } from '@/schemas/orders/OrderCreateSchema'
// import { OrderService } from '@/services/OrderService'
// import { faker } from '@faker-js/faker/locale/id_ID'
// import dayjs from 'dayjs'

// export async function seedOrders() {
//   console.log('Seeding orders...')
//   await recursiveCreate(0)
// }

// async function recursiveCreate(n: number) {
//   if (n >= 128) {
//     return;
//   }

//   const startDate = dayjs().add(faker.number.int({ min: -10, max: 1 }), 'month')
//   const endDate = startDate.add(faker.number.int({ min: 1, max: 2 }), 'day').unix();

//   const data: OrderCreate = {
//     customerAddress: faker.location.streetAddress(),
//     customerName: faker.person.fullName(),
//     customerPhone: faker.phone.number(),
//     note: faker.lorem.sentence(5),
//     startDate: startDate.unix(),
//     middleman: faker.datatype.boolean(),
//     status: new AppDate().unix >= endDate ? OrderStatusEnum.Done : OrderStatusEnum.Created,
//     endDate,
//     orderedProducts: new Array(faker.number.int({ min: 1, max: 3 })).fill(0).map(() => {
//       return {
//         baseQuantity: faker.number.int({ min: 1, max: 2 }),
//         orderedQuantity: faker.number.int({ min: 1, max: 2 }),
//         orderedUnitId: faker.number.int({ min: 1, max: 2 }),
//         productId: faker.number.int({ min: 1, max: 10 }),
//         price: faker.number.int({ min: 12, max: 50 }) * 100000,
//         employees: new Array(faker.number.int({ min: 1, max: 3 })).fill(0).map(() => faker.number.int({
//           min: 1,
//           max: 28,
//         })),
//       }
//     })
//   }

//   const result = await OrderService.create(data)
//   console.log(`  ${result[0].number} created!`)
//   await recursiveCreate(n + 1)
// }
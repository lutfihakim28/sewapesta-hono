import dayjs from 'dayjs'
import { db } from '..'
import { vehicles } from '../schema/vehicles'
import { faker } from '@faker-js/faker'
import { VehicleTypeEnum } from '@/enums/VehicleTypeEnum'

export async function seedVehicles() {
  console.log('Seeding vehicles...')

  await db.insert(vehicles).values([
    {
      createdAt: dayjs().unix(),
      licenseNumber: faker.vehicle.vrm(),
      name: faker.vehicle.vehicle(),
      type: faker.helpers.enumValue(VehicleTypeEnum),
    },
    {
      createdAt: dayjs().unix(),
      licenseNumber: faker.vehicle.vrm(),
      name: faker.vehicle.vehicle(),
      type: faker.helpers.enumValue(VehicleTypeEnum),
    },
    {
      createdAt: dayjs().unix(),
      licenseNumber: faker.vehicle.vrm(),
      name: faker.vehicle.vehicle(),
      type: faker.helpers.enumValue(VehicleTypeEnum),
    },
  ])
}
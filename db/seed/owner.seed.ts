import { db } from '..';
import { faker } from '@faker-js/faker/locale/id_ID'
import { owners } from '../schema/owners';
import dayjs from 'dayjs';
import { OwnerTypeEnum } from '@/enums/OwnerTypeEnum';

export async function seedOwners() {
  console.log('Seeding owners...')
  const length = 3;
  const names = new Array(length).fill('').map(() => faker.person.fullName());
  await db.insert(owners).values(new Array(length).fill('').map((_, index) => {
    return {
      name: names[index],
      phone: faker.phone.number(),
      type: faker.helpers.enumValue(OwnerTypeEnum),
    }
  }))
}
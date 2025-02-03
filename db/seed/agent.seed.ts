import { faker } from '@faker-js/faker/locale/id_ID';
import { db } from 'db/index';
import { agents } from 'db/schema/agents';

export async function seedAgents() {
  console.log('Seeding Agents');
  await db.insert(agents).values(new Array(5).fill(0).map((_) => ({
    name: faker.person.fullName(),
    phone: faker.phone.number(),
  })));
}
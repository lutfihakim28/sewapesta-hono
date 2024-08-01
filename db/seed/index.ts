import { seedCategories } from './categorySeeder';
import { seedEmployees } from './employeeSeeder';
import { seedItems } from './itemSeeder';
import { seedOwners } from './ownerSeeder';
import { seedUnits } from './unitSeeder';
import { seedUsers } from './userSeeder';
import { seedVehicles } from './vehicleSeeder';

await seedUsers()
await seedCategories()
await seedEmployees()
await seedOwners()
await seedUnits()
await seedItems()
await seedVehicles()

console.log('Seeding Complete')
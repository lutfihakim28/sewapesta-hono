import { seedCategories } from './categorySeeder';
import { seedEmployees } from './employeeSeeder';
import { seedItems } from './itemSeeder';
import { seedOrders } from './orderSeeder';
import { seedOwners } from './ownerSeeder';
import { seedProducts } from './productSeeder';
import { seedUnits } from './unitSeeder';
import { seedUsers } from './userSeeder';
import { seedVehicles } from './vehicleSeeder';

await seedUsers()
await seedCategories()
await seedEmployees()
await seedOwners()
await seedUnits()
await seedItems()
await seedProducts()
await seedVehicles()
await seedOrders()

console.log('Seeding Complete')
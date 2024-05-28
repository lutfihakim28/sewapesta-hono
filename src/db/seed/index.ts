import { seedCategories } from './categorySeeder';
import { seedEmployees } from './employeeSeeder';
import { seedItems } from './itemSeeder';
import { seedOwners } from './ownerSeeder';
import { seedSubcategories } from './subcategorySeeder';
import { seedUsers } from './userSeeder';

await seedUsers()
await seedCategories()
await seedSubcategories()
await seedEmployees()
await seedOwners()
await seedItems()

console.log('Seeding Complete')
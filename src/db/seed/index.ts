import { seedCategories } from './categorySeeder';
import { seedEmployees } from './employeeSeeder';
import { seedItems } from './itemSeeder';
import { seedOwners } from './ownerSeeder';
import { seedSubCategories } from './subCategorySeeder';
import { seedUsers } from './userSeeder';

await seedUsers()
await seedCategories()
await seedSubCategories()
await seedEmployees()
await seedOwners()
await seedItems()

console.log('Seeding Complete')
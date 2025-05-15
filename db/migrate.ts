import { db } from 'db';
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

migrate(db, { migrationsFolder: "./drizzle" });

// const inventoryQuantityTrigger = await Bun.file('db/triggers/inventory-item-quantity-trigger.sql').text();

// db.run(inventoryQuantityTrigger)

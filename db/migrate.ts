import { db } from 'db';
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

migrate(db, { migrationsFolder: "./drizzle" });

// const inventoryItemQuantityTrigger = await Bun.file('db/triggers/inventory-item-quantity-trigger.sql').text();

// db.run(inventoryItemQuantityTrigger)

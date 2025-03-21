import { db } from 'db';
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

migrate(db, { migrationsFolder: "./drizzle" });
db.run('PRAGMA foreign_keys = ON;')
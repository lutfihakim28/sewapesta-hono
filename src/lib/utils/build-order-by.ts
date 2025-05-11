import { asc, desc, SQL } from 'drizzle-orm';
import { SortEnum } from '../enums/SortEnum';
import { SQLiteTableWithColumns, TableConfig } from 'drizzle-orm/sqlite-core';

export function buildOrderBy<C extends keyof SQLiteTableWithColumns<T>, T extends TableConfig>(table: SQLiteTableWithColumns<T>, sortBy: C, sort: SortEnum = SortEnum.Ascending): SQL<unknown> {
  const orderBy = sort === SortEnum.Ascending
    ? asc(table[sortBy])
    : desc(table[sortBy])

  return orderBy;
}
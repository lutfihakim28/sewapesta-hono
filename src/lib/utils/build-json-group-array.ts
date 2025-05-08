import { sql, SQL } from 'drizzle-orm';
import { SQLiteColumn } from 'drizzle-orm/sqlite-core';

export function buildJsonGroupArray(fields: SQLiteColumn[], isPlainArray?: boolean): SQL<string> {
  return sql<string>`
    json_group_array(
        ${isPlainArray
      ? fields[0]
      : buildJsonObject(fields)
    }
    ) FILTER (WHERE ${fields[0]} IS NOT NULL)
  `
}

// json_object(
//   ${sql.join(
//     fields.map((column) => {
//       const columnNames = column.name.split('_')
//       const _key = columnNames.map((name, index) => {
//         if (index === 0) return name
//         return name.charAt(0).toUpperCase() + name.slice(1)
//       }).join('')
//       return sql`${sql.raw(`'${_key}'`)}, ${column}`
//     }),
//     sql`,`,
//   )}
// )

function buildJsonObject(fields: SQLiteColumn[]): SQL<string> {
  return sql`
    json_object(
      ${sql.join(
    fields.map((column) => {
      const columnNames = column.name.split('_')
      const _key = columnNames.map((name, index) => {
        if (index === 0) return name
        return name.charAt(0).toUpperCase() + name.slice(1)
      }).join('')
      return sql`${sql.raw(`'${_key}'`)}, ${column}`
    }),
    sql`,`,
  )}
    )
  `
}
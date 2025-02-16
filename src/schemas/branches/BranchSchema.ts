import { z } from '@hono/zod-openapi';
import { branches } from 'db/schema/branches';
import { createSelectSchema } from 'drizzle-zod';

const _BranchSchema = createSelectSchema(branches)
  .pick({
    id: true,
    name: true,
    cpPhone: true,
    cpName: true,
    address: true,
  })


export const BranchSchema = _BranchSchema.extend({}).openapi('Branch')

export type Branch = z.infer<typeof BranchSchema>

import { SortSchema } from '../SortSchema';
import { SearchSchema } from '../SearchSchema';
import { PaginationSchema } from '../PaginationSchema';
import { z } from 'zod';
import { owners } from 'db/schema/owners';
import { OwnerTypeEnum } from '@/lib/enums/OwnerTypeEnum';
import { validationMessages } from '@/lib/constants/validationMessage';

export type OwnerColumn = keyof typeof owners.$inferSelect;

const _SortSchema = SortSchema<OwnerColumn>([
  'createdAt',
  'id',
  'name',
  'phone',
] as const)

export const OwnerFilterSchema = z.object({
  type: z.nativeEnum(OwnerTypeEnum, { message: validationMessages.enum('Tipe', OwnerTypeEnum) }).openapi({ example: OwnerTypeEnum.Individu })
}).partial()
  .merge(_SortSchema)
  .merge(SearchSchema)
  .merge(PaginationSchema)
  .openapi('OnwerFilter')

export type OwnerFilter = z.infer<typeof OwnerFilterSchema>
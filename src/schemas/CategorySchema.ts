import { z } from 'zod';
import { categoriesTable } from '@/db/schema/categories';
import { SubCategoryResponseSchema } from './SubCategorySchema';

type InsertCategoryType = typeof categoriesTable.$inferInsert;

export const CategoryRequestSchema: z.ZodType<InsertCategoryType> = z.object({
  name: z.string({
    message: 'Nama harus diisi.'
  }).openapi({
    example: 'Pencahayaan',
  }),
}).openapi('CategoryRequest')

export const CategoryResponseSchema = z.object({
  id: z.number().openapi({
    example: 1,
  }),
  name: z.string().openapi({
    example: 'Sound'
  }),
  deletedAt: z
    .date()
    .nullable()
    .openapi({
      example: null,
    }),
}).openapi('Category')

export const CategoryResponseRelationSchema = z.object({
  id: z.number().openapi({
    example: 1,
  }),
  name: z.string().openapi({
    example: 'Sound'
  }),
  deletedAt: z
    .date()
    .nullable()
    .openapi({
      example: null,
    }),
  subCategories: z.array(SubCategoryResponseSchema)
}).openapi('CategoryRelation')

export type CategoryRequest = z.infer<typeof CategoryRequestSchema>
export type CategoryRelationsResponse = z.infer<typeof CategoryResponseRelationSchema>;
export type CategoryResponse = z.infer<typeof CategoryResponseSchema>;
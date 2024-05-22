import { z } from 'zod';
import { subCategoriesTable } from '@/db/schema/subCategories';

type InsertSubCategoryType = typeof subCategoriesTable.$inferInsert;

export const SubCategoryRequestSchema: z.ZodType<InsertSubCategoryType> = z.object({
  name: z
    .string({
      message: 'Nama harus diisi.'
    })
    .openapi({
      example: 'Genset 20v',
    }),
  categoryId: z
    .number({
      message: 'ID Kategori harus berupa angka.'
    })
    .positive({
      message: 'ID Kategori harus positif.'
    })
    .optional()
    .openapi({
      example: 1,
    })
}).openapi('SubCategoryRequest')

export const SubCategoryResponseSchema = z.object({
  id: z
    .number()
    .openapi({
      example: 1,
    }),
  name: z
    .string()
    .openapi({
      example: 'Genset 20v'
    }),
  deletedAt: z
    .date()
    .nullable()
    .openapi({
      example: null,
    }),
  categoryId: z
    .number()
    .nullable()
    .openapi({
      example: 1
    }),
}).openapi('SubCategory')

export const SubCategoryResponseRelationSchema = z.object({
  id: z
    .number()
    .openapi({
      example: 1,
    }),
  name: z
    .string()
    .openapi({
      example: 'Genset 20v'
    }),
  deletedAt: z
    .date()
    .nullable()
    .openapi({
      example: null,
    }),
  categoryId: z
    .number()
    .nullable()
    .openapi({
      example: 1
    }),
  category: z.object({
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
  }).openapi('Category'),
}).openapi('SubCategoryRelation')

export type CategoryRequest = z.infer<typeof SubCategoryRequestSchema>
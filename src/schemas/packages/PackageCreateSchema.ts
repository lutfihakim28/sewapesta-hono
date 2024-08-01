import { validationMessages } from '@/constatnts/validationMessages';
import { packagesTable } from 'db/schema/packages';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const _PackageCreateSchema = createInsertSchema(packagesTable, {
  name: z.string().openapi({ example: 'Event kecil' }).nullable(),
  overtimeRatio: z.number().positive({ message: validationMessages.positiveNumber('Persentase lembur') }).max(1, validationMessages.maxNumber('Persentase Lembur', 1)).nullable(),
  price: z.number({ message: validationMessages.requiredNumber('Harga') }).positive()
}).pick({
  name: true,
  overtimeRatio: true,
  price: true,
})

export type PackageCreate = z.infer<typeof _PackageCreateSchema> & {
  items: Array<number>
}

export const PackageCreateSchema: z.ZodType<PackageCreate> = _PackageCreateSchema.extend({
  items: z.array(z.number({ message: validationMessages.requiredNumber('ID barang') }), {
    message: validationMessages.required('Barang')
  })
}).openapi('PackageRequest')
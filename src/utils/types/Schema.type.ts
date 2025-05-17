import { z, ZodType } from 'zod';

export type SchemaType<T extends ZodType<any, any, any>> = z.infer<T>
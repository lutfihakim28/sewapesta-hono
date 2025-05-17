import { z } from 'zod';

export class UnionSchema<T extends readonly [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]]> {
  #schema!: z.ZodUnion<T>

  constructor(types: T) {
    this.#schema = z.union(types)
  }

  getSchema() {
    return this.#schema;
  }
}
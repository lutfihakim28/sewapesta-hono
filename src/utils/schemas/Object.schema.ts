import { ZodObject, ZodRawShape, z } from 'zod';

export class ObjectSchema<T extends ZodRawShape> {
  #schema!: ZodObject<T>

  constructor(shape: T) {
    this.#schema = z.object(shape)
  }

  getSchema() {
    return this.#schema;
  }
}
import { z } from 'zod';
import { validationMessages } from '../constants/validation-message';

export class BooleanSchema {
  #schema!: z.ZodBoolean | z.ZodEffects<z.ZodBoolean, boolean, unknown>;
  #field!: string

  constructor(field: string) {
    this.#field = field;
  }

  getSchema() {
    this.#schema = z.boolean({
      invalid_type_error: validationMessages.boolean(this.#field),
      required_error: validationMessages.required(this.#field)
    })
    return this.#schema;
  }

  getQuerySchema() {
    this.#schema = z.preprocess((value) => {
      if (value === 'true' || value === '1') return true
      if (value === 'false' || value === '0' || value === '') return false
      return value
    }, z.boolean({
      invalid_type_error: validationMessages.boolean(this.#field),
    }))
    return this.#schema
  }
}
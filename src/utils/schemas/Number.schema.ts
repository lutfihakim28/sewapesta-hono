import { z } from 'zod';
import { validationMessages } from '../constants/validation-message';

export class NumberSchema {
  #schema!: z.ZodNumber
  #field!: string

  constructor(field: string) {
    this.#schema = z.number({
      invalid_type_error: validationMessages.number(field),
      required_error: validationMessages.required(field)
    })
    this.#field = field;
  }

  getSchema() {
    return this.#schema;
  }

  positive() {
    this.#schema.positive({
      message: validationMessages.positiveNumber(this.#field)
    })
    return this;
  }

  nonnegative() {
    this.#schema.positive({
      message: validationMessages.nonNegativeNumber(this.#field)
    })
    return this;
  }

  integer() {
    this.#schema.int({
      message: validationMessages.integer(this.#field)
    })
    return this;
  }

  natural() {
    return this.integer().positive();
  }

  whole() {
    return this.integer().nonnegative();
  }
}
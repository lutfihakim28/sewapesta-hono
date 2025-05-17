import { z } from 'zod';
import { validationMessages } from '../constants/validation-message';

export class ArraySchema<T extends z.ZodTypeAny> {
  #schema!: z.ZodArray<T>;
  #field: string;

  constructor(field: string, elements: T) {
    this.#field = field;
    this.#schema = z.array(elements, {
      invalid_type_error: validationMessages.array(field),
      required_error: validationMessages.required(field),
    })
  }

  getSchema() {
    return this.#schema;
  }

  nonempty() {
    this.#schema.nonempty(`${this.#field} can not be empty.`)
    return this;
  }
}
import { EnumLike, z, ZodNativeEnum } from 'zod';
import { validationMessages } from '../constants/validation-message';

export class EnumSchema<T extends EnumLike> {
  #schema!: ZodNativeEnum<T>

  constructor(field: string, nativeEnum: T) {
    this.#schema = z.nativeEnum(nativeEnum, {
      invalid_type_error: validationMessages.enum(field, nativeEnum),
      required_error: validationMessages.required(field),
    })
  }

  getSchema() {
    return this.#schema;
  }
}
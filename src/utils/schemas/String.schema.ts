import { z } from 'zod';
import { validationMessages } from '../constants/validation-message';

export class StringSchema {
  #schema!: z.ZodString
  #field!: string;

  constructor(field: string) {
    this.#schema = z.string({
      invalid_type_error: validationMessages.string(field),
      required_error: validationMessages.required(field)
    })
    this.#field = field;
  }

  getSchema() {
    return this.#schema;
  }

  neutralNumeric() {
    this.#schema = this.#schema.regex(/^[1-9]\d*$/, {
      message: validationMessages.numeric(this.#field),
    });
    return this;
  }

  phone() {
    this.#schema = this.#schema
      .regex(/^\d+(\.\d+)?$/, {
        message: validationMessages.numeric('Phone number'),
      }).regex(/^628[1-9][0-9]{6,9}$/, {
        message: 'Phone number should start with 628 with minimum 10 digits and maximum 13 digits.'
      })
    return this;
  }

  min(length: number) {
    this.#schema = this.#schema.min(length, {
      message: validationMessages.minLength(this.#field, length)
    })
    return this;
  }

  length(length: number) {
    this.#schema = this.#schema.length(length, {
      message: validationMessages.length(this.#field, length)
    })
    return this;
  }

  subdistrictCode() {
    this.#schema = this.#schema.regex(/^[1-9]{2}\.[0-9]{2}\.[0-9]{2}\.[1-9][0-9]{2}[1-9]$/, {
      message: 'Should in format xx.xx.xx.xxxx'
    })
    return this;
  }

  districtCode() {
    this.#schema = this.#schema.regex(/^[1-9]{2}\.[0-9]{2}\.[0-9]{2}$/, {
      message: 'Should in format xx.xx.xx'
    })
    return this;
  }

  cityCode() {
    this.#schema = this.#schema.regex(/^[1-9]{2}\.[0-9]{2}$/, {
      message: 'Should in format xx.xx'
    })
    return this;
  }

  provinceCode() {
    this.#schema = this.#schema.regex(/^[1-9]{2}$/, {
      message: 'Should in format xx'
    })
    return this;
  }
}
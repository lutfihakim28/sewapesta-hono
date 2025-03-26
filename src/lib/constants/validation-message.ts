import { EnumLike } from 'zod';

export const validationMessages = {
  required: (field: string) => `${field} is required.`,
  string: (field: string) => `${field} should be string.`,
  number: (field: string) => `${field} should be valid number.`,
  numeric: (field: string) => `${field} should be numeric string.`,
  positiveNumber: (field: string) => `${field} should be valid positive number.`,
  maxNumber: (field: string, max: number) => `Maximum ${field} is ${max}.`,
  minNumber: (field: string, min: number) => `Minimum ${field} is ${min}.`,
  minLength: (field: string, length: number) => `${field} should be minimum ${length} length.`,
  maxLength: (field: string, length: number) => `${field} should be maximum ${length} length.`,
  enum: (field: string, enums: EnumLike) => `${field} should be one of [${Object.values(enums)}].`,
  array: (field: string) => `${field} should be an array.`
}
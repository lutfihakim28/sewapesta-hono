import { EnumLike } from 'zod';

export const validationMessages = {
  required: (field: string) => `${field} is required.`,
  requiredNumber: (field: string) => `${field} shoul be invalid number.`,
  positiveNumber: (field: string) => `${field} shoul be invalid positive number.`,
  maxNumber: (field: string, max: number) => `Maksimum ${field} is ${max}.`,
  minNumber: (field: string, min: number) => `Minimum ${field} is ${min}.`,
  minLength: (field: string, length: number) => `${field} should be minimum ${length} length.`,
  maxLength: (field: string, length: number) => `${field} should be maximum ${length} length.`,
  enum: (field: string, enums: EnumLike) => `${field} should be one of [${Object.values(enums)}].`,
}
import { EnumLike } from 'zod';

export const validationMessages = {
  required: (field: string) => `${field} harus diisi.`,
  requiredNumber: (field: string) => `${field} harus diisi angka.`,
  positiveNumber: (field: string) => `${field} harus diisi angka positif.`,
  minLength: (field: string, length: number) => `${field} minimal ${length} karakter.`,
  maxLength: (field: string, length: number) => `${field} maksimal ${length} karakter.`,
  enum: (field: string, enums: EnumLike) => `${field} harus merupakan elemen dari [${Object.values(enums)}].`,
}
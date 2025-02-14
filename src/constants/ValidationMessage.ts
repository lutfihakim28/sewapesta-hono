import { EnumLike } from 'zod';

export const validationMessages = {
  required: (field: string) => `${field} harus diisi.`,
  requiredNumber: (field: string) => `${field} harus diisi angka.`,
  positiveNumber: (field: string) => `${field} harus diisi angka positif.`,
  maxNumber: (field: string, max: number) => `Maksimal ${field} adalah ${max}.`,
  minLength: (field: string, length: number) => `${field} minimal ${length} karakter.`,
  maxLength: (field: string, length: number) => `${field} maksimal ${length} karakter.`,
  enum: (field: string, enums: EnumLike) => `${field} harus merupakan elemen dari [${Object.values(enums)}].`,
}

export class ValidationMessage {
  public static required(field: string) {
    return `${field} harus diisi.`
  }
  public static requiredNumber(field: string) {
    return `${field} harus diisi angka.`
  }
  public static positiveNumber(field: string) {
    return `${field} harus diisi angka positif.`
  }
  public static maxNumber(field: string, max: number) {
    return `Maksimal ${field} adalah ${max}.`
  }
  public static minLength(field: string, length: number) {
    return `${field} minimal ${length} karakter.`
  }
  public static maxLength(field: string, length: number) {
    return `${field} maksimal ${length} karakter.`
  }
  public static enum(field: string, enums: EnumLike) {
    return `${field} harus merupakan elemen dari [${Object.values(enums)}].`
  }
}
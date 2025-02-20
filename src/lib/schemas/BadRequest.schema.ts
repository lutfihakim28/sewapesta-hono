import { validationMessages } from '@/lib/constants/validationMessage';
import { ApiResponseSchema } from './ApiResponse.schema';

export const BadRequestSchema = ApiResponseSchema(validationMessages.required('Nama')).openapi('BadRequest')
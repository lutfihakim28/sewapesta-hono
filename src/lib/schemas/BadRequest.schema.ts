import { validationMessages } from '@/lib/constants/validationMessage';
import { ApiResponseSchema } from './ApiResponse.schema';

export const BadRequestSchema = ApiResponseSchema(validationMessages.required('Name'), 422).openapi('BadRequest')
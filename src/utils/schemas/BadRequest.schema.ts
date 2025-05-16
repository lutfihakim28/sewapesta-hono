import { validationMessages } from '@/utils/constants/validation-message';
import { ApiResponseSchema } from './ApiResponse.schema';

export const BadRequestSchema = ApiResponseSchema(validationMessages.required('Name'), 422).openapi('BadRequest')
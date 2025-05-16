import { messages } from '@/utils/constants/messages';
import { ApiResponseSchema } from './ApiResponse.schema';

export const NotFoundSchema = ApiResponseSchema(messages.errorNotFound('User'), 404).openapi('NotFound')
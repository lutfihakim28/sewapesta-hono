import { messages } from '@/lib/constants/messages';
import { ApiResponseSchema } from './ApiResponse.schema';

export const NotFoundSchema = ApiResponseSchema(messages.errorNotFound('User'), 404).openapi('NotFound')
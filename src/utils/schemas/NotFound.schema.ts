import { messages } from '@/utils/constants/locales/messages';
import { ApiResponseSchema } from './ApiResponse.schema';

export const NotFoundSchema = ApiResponseSchema(messages.errorNotFound('User'), 404).openapi('NotFound')
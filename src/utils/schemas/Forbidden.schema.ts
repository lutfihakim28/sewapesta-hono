import { messages } from '@/utils/constants/locales/messages';
import { ApiResponseSchema } from './ApiResponse.schema';

export const ForbiddenSchema = ApiResponseSchema(messages.forbidden, 403).openapi('Forbidden')
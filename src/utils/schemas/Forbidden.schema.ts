import { messages } from '@/utils/constants/messages';
import { ApiResponseSchema } from './ApiResponse.schema';

export const ForbiddenSchema = ApiResponseSchema(messages.forbidden, 403).openapi('Forbidden')
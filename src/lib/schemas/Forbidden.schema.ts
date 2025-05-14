import { messages } from '@/lib/constants/messages';
import { ApiResponseSchema } from './ApiResponse.schema';

export const ForbiddenSchema = ApiResponseSchema(messages.forbidden, 403).openapi('Forbidden')
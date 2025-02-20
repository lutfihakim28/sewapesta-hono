import { messages } from '@/lib/constants/messages';
import { ApiResponseSchema } from './ApiResponse.schema';

export const UnauthorizedSchema = ApiResponseSchema(messages.unauthorized).openapi('Unauthorized')
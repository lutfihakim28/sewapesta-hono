import { messages } from '@/utils/constants/messages';
import { ApiResponseSchema } from './ApiResponse.schema';

export const UnauthorizedSchema = ApiResponseSchema(messages.unauthorized, 401).openapi('Unauthorized')
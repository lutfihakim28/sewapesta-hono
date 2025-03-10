import { messages } from '@/lib/constants/messages';
import { ApiResponseSchema } from './ApiResponse.schema';

export const ServerErrorSchema = ApiResponseSchema(messages.errorServer, 500).openapi('ServerError')
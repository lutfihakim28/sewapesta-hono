import { messages } from '@/utils/constants/locales/messages';
import { ApiResponseSchema } from './ApiResponse.schema';

export const ServerErrorSchema = ApiResponseSchema(messages.errorServer, 500).openapi('ServerError')
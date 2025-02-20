import { messages } from '@/lib/constants/messages';
import { ApiResponseSchema } from './ApiResponse.schema';

export const SuccessSchema = ApiResponseSchema(messages.successDetail('pengguna')).openapi('Success')
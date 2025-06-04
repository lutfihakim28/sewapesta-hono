import { tMessage } from '../constants/locales/locale';
import { ApiResponseSchema } from './ApiResponse.schema';

export const UnauthorizedSchema = ApiResponseSchema(tMessage({
  lang: 'en',
  key: 'unauthorized',
  textCase: 'sentence'
}), 401).openapi('Unauthorized')
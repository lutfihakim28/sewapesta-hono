import { tMessage } from '../constants/locales/locale';
import { ApiResponseSchema } from './ApiResponse.schema';

export const ForbiddenSchema = ApiResponseSchema(tMessage({
  lang: 'en',
  key: 'forbidden',
  textCase: 'sentence'
}), 403).openapi('Forbidden')
import { tMessage } from '../constants/locales/locale';
import { ApiResponseSchema } from './ApiResponse.schema';

export const ServerErrorSchema = ApiResponseSchema(tMessage({
  lang: 'en',
  key: 'errorServer',
  textCase: 'sentence'
}), 500).openapi('ServerError')
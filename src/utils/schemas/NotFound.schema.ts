import { tMessage } from '../constants/locales/locale';
import { ApiResponseSchema } from './ApiResponse.schema';

export const NotFoundSchema = ApiResponseSchema(tMessage({
  lang: 'en',
  key: 'errorNotFound',
  textCase: 'sentence',
  params: {
    data: 'User'
  }
}), 404).openapi('NotFound')
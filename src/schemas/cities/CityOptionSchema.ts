import { z } from 'zod';
import { ResponseSchema } from '../ResponseSchema';
import { messages } from '@/constants/message';
import { OptionSchema } from '../OptionSchema';

export const CityOptionSchema = ResponseSchema(z.array(OptionSchema), messages.successList('opsi kabupaten/kota'))
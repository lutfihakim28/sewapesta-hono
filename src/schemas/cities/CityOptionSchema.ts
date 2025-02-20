import { z } from 'zod';
import { ResponseSchema } from '../ResponseSchema';
import { messages } from '@/lib/constants/messages';
import { OptionSchema } from '../OptionSchema';

export const CityOptionSchema = ResponseSchema(z.array(OptionSchema), messages.successList('opsi kabupaten/kota'))
import { z } from 'zod';
import { ResponseSchema } from '../ResponseSchema';
import { messages } from '@/lib/constants/messages';
import { OptionSchema } from '../OptionSchema';

export const ProvinceOptionSchema = ResponseSchema(z.array(OptionSchema), messages.successList('opsi provinsi'))
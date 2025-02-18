import { z } from 'zod';
import { ResponseSchema } from '../ResponseSchema';
import { MESSAGES } from '@/lib/constants/MESSAGES';
import { OptionSchema } from '../OptionSchema';

export const SubdistrictOptionSchema = ResponseSchema(z.array(OptionSchema), MESSAGES.successList('opsi kelurahan'))
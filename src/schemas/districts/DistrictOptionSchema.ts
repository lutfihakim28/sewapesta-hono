import { z } from 'zod';
import { ResponseSchema } from '../ResponseSchema';
import { MESSAGES } from '@/lib/constants/MESSAGES';
import { OptionSchema } from '../OptionSchema';

export const DistrictOptionSchema = ResponseSchema(z.array(OptionSchema), MESSAGES.successList('opsi kecamatan'))
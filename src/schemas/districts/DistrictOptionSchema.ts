import { z } from 'zod';
import { ResponseSchema } from '../ResponseSchema';
import { messages } from '@/constants/message';
import { OptionSchema } from '../OptionSchema';

export const DistrictOptionSchema = ResponseSchema(z.array(OptionSchema), messages.successList('opsi kecamatan'))
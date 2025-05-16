import { BadRequestException } from '@/lib/exceptions/BadRequestException';
import { OpenAPIHono } from '@hono/zod-openapi';
import { pinoLogger } from './logger';

export function honoApp() {
  return new OpenAPIHono({
    defaultHook: (result) => {
      if (result.success) {
        return;
      }
      pinoLogger.info({ message: 'ZodError', error: result.error.errors })
      throw new BadRequestException(result.error.errors.map((err) => err.message).join(','))
    },
  })
}

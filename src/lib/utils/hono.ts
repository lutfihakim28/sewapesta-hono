import { BadRequestException } from '@/lib/exceptions/BadRequestException';
import { OpenAPIHono } from '@hono/zod-openapi';
import { logger } from './logger';

export function honoApp() {
  return new OpenAPIHono({
    defaultHook: (result) => {
      if (result.success) {
        return;
      }
      logger.info({ message: 'ZodError', error: result.error.errors })
      throw new BadRequestException(result.error.errors.map((err) => err.message).join(','))
    },
  })
}

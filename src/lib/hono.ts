import { BadRequestException } from '@/exceptions/BadRequestException';
import { OpenAPIHono } from '@hono/zod-openapi';

export function honoApp() {
  return new OpenAPIHono({
    defaultHook: (result) => {
      if (result.success) {
        return;
      }
      throw new BadRequestException(result.error.errors.map((e) => e.message))
    },
  })
}

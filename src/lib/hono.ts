import { InvalidException } from '@/exceptions/InvalidException';
import { OpenAPIHono } from '@hono/zod-openapi';

export function honoApp() {
  return new OpenAPIHono({
    defaultHook: (result) => {
      if (result.success) {
        return;
      }
      throw new InvalidException(result.error.errors.map((e) => e.message))
    },
  })
};

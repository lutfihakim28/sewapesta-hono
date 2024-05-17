import { OpenAPIHono } from '@hono/zod-openapi';

export function honoApp() {
  return new OpenAPIHono({
    defaultHook: (result, context) => {
      if (result.success) {
        return;
      }
      return context.json({
        code: 422,
        messages: result.error.errors.map((e) => e.message)
      }, 422)
    },
  })
};

import { MESSAGES } from '@/lib/constants/MESSAGES';
import { honoApp } from '@/lib/hono';
import { SuccessSchema } from '@/schemas/SuccessSchema';
import { SQLTestService } from '@/services/SQLTestService';
import { createRoute } from '@hono/zod-openapi';

const SQLTestController = honoApp()

SQLTestController.openapi(createRoute({
  method: 'get',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SuccessSchema
        },
      },
      description: 'Retrieve list items',
    }
  },
  path: '',
}), async (context) => {
  const data = await SQLTestService.test();
  return context.json({
    code: 200,
    messages: MESSAGES.successList('kategori'),
    data
  }, 200)
})


export default SQLTestController
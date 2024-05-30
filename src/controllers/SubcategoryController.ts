import { messages } from '@/constatnts/messages';
import { honoApp } from '@/lib/hono';
import { CreateSubcategoryRoute, DeleteSubcategoryRoute, UpdateSubcategoryRoute } from '@/routes/SubcategoryRoute'
import { SubcategoryService } from '@/services/SubcategoryService';

const SubcategoryController = honoApp();

SubcategoryController.openapi(CreateSubcategoryRoute, async (context) => {
  const payload = context.req.valid('json');

  const subcategory = await SubcategoryService.create(payload);

  return context.json({
    code: 200,
    messages: [messages.successCreate('subkategori')],
    data: subcategory,
  }, 200)
})

SubcategoryController.openapi(UpdateSubcategoryRoute, async (context) => {
  const param = context.req.valid('param');
  const payload = context.req.valid('json');

  const subcategory = await SubcategoryService.update(param, payload)

  return context.json({
    code: 200,
    messages: [messages.successUpdate('subkategori')],
    data: subcategory,
  }, 200)
})

SubcategoryController.openapi(DeleteSubcategoryRoute, async (context) => {
  const param = context.req.valid('param');

  await SubcategoryService.delete(param);

  return context.json({
    code: 200,
    messages: [messages.successDelete('subkategori')]
  }, 200)
})

export default SubcategoryController;
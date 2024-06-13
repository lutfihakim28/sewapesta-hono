import { messages } from '@/constatnts/messages';
import { honoApp } from '@/lib/hono';
import { CreateCategoryRoute, DeleteCategoryRoute, ListCategoryRoute, UpdateCategoryRoute } from '@/routes/CategoryRoute';
import { CategoryService } from '@/services/CategoryService';

const CategoryController = honoApp()

CategoryController.openapi(ListCategoryRoute, async (context) => {
  const categories = await CategoryService.getList();

  return context.json({
    code: 200,
    messages: messages.successList('kategori'),
    data: categories,
  }, 200)
})

CategoryController.openapi(CreateCategoryRoute, async (context) => {
  const payload = context.req.valid('json');

  await CategoryService.create(payload);

  return context.json({
    code: 200,
    messages: messages.successCreate('kategori'),
  }, 200)
})

CategoryController.openapi(UpdateCategoryRoute, async (context) => {
  const payload = context.req.valid('json');
  const param = context.req.valid('param');

  await CategoryService.update(param, payload);

  return context.json({
    code: 200,
    messages: messages.successUpdate('kategori'),
  }, 200)
})

CategoryController.openapi(DeleteCategoryRoute, async (context) => {
  const param = context.req.valid('param');

  await CategoryService.delete(param);

  return context.json({
    code: 200,
    messages: messages.successDelete('kategori'),
  }, 200)
})

export default CategoryController;
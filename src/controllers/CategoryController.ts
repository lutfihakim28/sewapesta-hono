import { honoApp } from '@/lib/hono';
import { CreateCategoryRoute, DeleteCategoryRoute, ListCategoryRoute, UpdateCategoryRoute } from '@/routes/CategoryRoute';
import { CategoryService } from '@/services/CategoryService';

const CategoryController = honoApp()

CategoryController.openapi(ListCategoryRoute, async (context) => {
  const categories = await CategoryService.getList();

  return context.json({
    code: 200,
    messages: ['Berhasil mendapatkan daftar kategori.'],
    data: categories,
  }, 200)
})

CategoryController.openapi(CreateCategoryRoute, async (context) => {
  const payload = context.req.valid('json');

  const category = await CategoryService.create(payload);

  return context.json({
    code: 200,
    messages: ['Berhasil membuat kategori baru.'],
    data: category,
  }, 200)
})

CategoryController.openapi(UpdateCategoryRoute, async (context) => {
  const payload = context.req.valid('json');
  const param = context.req.valid('param');

  const category = await CategoryService.update(param, payload);

  return context.json({
    code: 200,
    messages: [`Berhasil mengubah kategori ${category.name}.`],
    data: category,
  }, 200)
})

CategoryController.openapi(DeleteCategoryRoute, async (context) => {
  const param = context.req.valid('param');

  await CategoryService.delete(param);

  return context.json({
    code: 200,
    messages: ['Berhasil menghapus kategori.'],
  }, 200)
})

export default CategoryController;
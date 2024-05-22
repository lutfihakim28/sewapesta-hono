import { honoApp } from '@/lib/hono';
import { CreateCategoryRoute, DeleteCategoryRoute, DetailCategoryRoute, ListCategoryRoute, UpdateCategoryRoute } from '@/routes/CategoryRoute';
import { CategoryService } from '@/services/CategoryService';

const CategoryController = honoApp()

CategoryController.openapi(ListCategoryRoute, async (context) => {
  try {
    const categories = await CategoryService.getCategories();

    return context.json({
      code: 200,
      messages: ['Berhasil mendapatkan daftar kategori.'],
      data: categories,
    }, 200)
  } catch (error) {
    return context.json({
      code: 500,
      messages: ['Terjadi kesalahan server.'],
    }, 500)
  }
})

CategoryController.openapi(DetailCategoryRoute, async (context) => {
  try {
    const param = context.req.valid('param');

    const category = await CategoryService.getCategory(param);

    if (!category) {
      return context.json({
        code: 404,
        messages: ['Kategori tidak ditemukan'],
      }, 404)
    }

    return context.json({
      code: 200,
      messages: ['Berhasil mendapatkan daftar kategori.'],
      data: category,
    }, 200)
  } catch (error) {
    return context.json({
      code: 500,
      messages: ['Terjadi kesalahan server.'],
    }, 500)
  }
})

CategoryController.openapi(CreateCategoryRoute, async (context) => {
  try {
    const payload = context.req.valid('json');

    const category = await CategoryService.createCategory(payload);

    return context.json({
      code: 200,
      messages: ['Berhasil membuat kategori baru.'],
      data: category,
    }, 200)
  } catch (error) {
    return context.json({
      code: 500,
      messages: ['Terjadi kesalahan server.'],
    }, 500)
  }
})

CategoryController.openapi(UpdateCategoryRoute, async (context) => {
  try {
    const payload = context.req.valid('json');
    const param = context.req.valid('param');

    const category = await CategoryService.updateCategory(param, payload);

    return context.json({
      code: 200,
      messages: [`Berhasil mengubah kategori ${category.name}.`],
      data: category,
    }, 200)
  } catch (error) {
    return context.json({
      code: 500,
      messages: ['Terjadi kesalahan server.'],
    }, 500)
  }
})

CategoryController.openapi(DeleteCategoryRoute, async (context) => {
  try {
    const param = context.req.valid('param');

    await CategoryService.deleteCategory(param);

    return context.json({
      code: 200,
      messages: ['Berhasil menghapus kategori.'],
    }, 200)
  } catch (error) {
    return context.json({
      code: 500,
      messages: ['Terjadi kesalahan server.'],
    }, 500)
  }
})

export default CategoryController;
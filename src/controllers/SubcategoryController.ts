import { honoApp } from '@/lib/hono';
import { CreateSubcategoryRoute, DeleteSubcategoryRoute, UpdateSubcategoryRoute } from '@/routes/SubcategoryRoute'
import { SubcategoryService } from '@/services/SubcategoryService';

const SubcategoryController = honoApp();

SubcategoryController.openapi(CreateSubcategoryRoute, async (context) => {
  try {
    const payload = context.req.valid('json');

    const subcategory = await SubcategoryService.create(payload);

    return context.json({
      code: 200,
      messages: ['Berhasil menambahkan subkategori.'],
      data: subcategory,
    }, 200)
  } catch (error) {
    return context.json({
      code: 500,
      messages: ['Terjadi kesalahan server.'],
    }, 500)
  }
})

SubcategoryController.openapi(UpdateSubcategoryRoute, async (context) => {
  try {
    const param = context.req.valid('param');
    const payload = context.req.valid('json');

    const subcategory = await SubcategoryService.update(param, payload)

    return context.json({
      code: 200,
      messages: [`Berhasil mengubah subkategori ${subcategory.name}.`],
      data: subcategory,
    }, 200)
  } catch (error) {
    return context.json({
      code: 500,
      messages: ['Terjadi kesalahan server.'],
    }, 500)
  }
})

SubcategoryController.openapi(DeleteSubcategoryRoute, async (context) => {
  try {
    const param = context.req.valid('param');

    await SubcategoryService.delete(param);

    return context.json({
      code: 200,
      messages: ['Berhasil menghapus subkategori.']
    }, 200)
  } catch (error) {
    return context.json({
      code: 500,
      messages: ['Terjadi kesalahan server.'],
    }, 500)
  }
})

export default SubcategoryController;
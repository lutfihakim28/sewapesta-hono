import { honoApp } from '@/lib/utils/hono';
import { CategoryCreateRoute, CategoryDeleteRoute, CategoryListRoute, CategoryUpdateRoute } from './Category.route';
import { CategoryService } from './Category.service';
import { ApiResponse, ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
import { messages } from '@/lib/constants/messages';
import { Meta } from '@/lib/dtos/Meta.dto';

const CategoryController = honoApp()

CategoryController.openapi(CategoryListRoute, async (context) => {
  const query = context.req.valid('query')

  const [categories, totalData] = await CategoryService.list(query)

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('category')],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: categories
  }), 200)
})

CategoryController.openapi(CategoryCreateRoute, async (context) => {
  const payload = context.req.valid('json');

  await CategoryService.create(payload)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successCreate(`Category with name ${payload.name}`)],
  }), 200)
})

CategoryController.openapi(CategoryUpdateRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  await CategoryService.update(+param.id, payload);

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successUpdate(`Category with ID ${param.id}`)],
  }), 200)
})

CategoryController.openapi(CategoryDeleteRoute, async (context) => {
  const param = context.req.valid('param')

  await CategoryService.delete(+param.id)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successDelete(`Category with ID ${param.id}`)]
  }), 200)
})

export default CategoryController
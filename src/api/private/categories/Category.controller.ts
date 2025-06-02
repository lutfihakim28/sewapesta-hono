import { honoApp } from '@/utils/helpers/hono';
import { CategoryCheckRoute, CategoryCreateRoute, CategoryDeleteRoute, CategoryListRoute, CategoryOptionRoute, CategoryUpdateRoute } from 'src/api/private/categories/Category.route';
import { CategoryService } from './Category.service';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { messages } from '@/utils/constants/locales/messages';
import { Meta } from '@/utils/dtos/Meta.dto';

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

CategoryController.openapi(CategoryOptionRoute, async (context) => {

  const categories = await CategoryService.options()

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successList('category options')],
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

CategoryController.openapi(CategoryCheckRoute, async (context) => {
  const query = context.req.valid('query')

  await CategoryService.checkAvailability(query)

  return context.json(new ApiResponse({
    code: 200,
    messages: ['Category\'s name is available.']
  }), 200)
})

export default CategoryController
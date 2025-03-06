import { honoApp } from '@/lib/utils/hono';
import { CategoryCreateRoute, CategoryDeleteRoute, CategoryListRoute, CategoryUpdateRoute } from './Category.route';
import { JwtPayload } from '@/lib/dtos/JwtPayload.dto';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { checkPermissions } from '@/lib/utils/checkPermissions';
import { CategoryService } from './Category.service';
import { ApiResponse, ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
import { messages } from '@/lib/constants/messages';
import { Meta } from '@/lib/dtos/Meta.dto';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';

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
    messages: [messages.successCreate('category')],
  }), 200)
})

CategoryController.openapi(CategoryUpdateRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const category = await CategoryService.update(+param.id, payload);

  if (!category) {
    throw new NotFoundException(messages.errorNotFound(`Category with ID ${param.id}`))
  }

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successUpdate('category')],
  }), 200)
})

CategoryController.openapi(CategoryDeleteRoute, async (context) => {
  const param = context.req.valid('param')

  const category = await CategoryService.delete(+param.id)

  if (!category) {
    throw new NotFoundException(messages.errorNotFound(`Category with ID ${param.id}`))
  }

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successDelete('category')]
  }), 200)
})

export default CategoryController
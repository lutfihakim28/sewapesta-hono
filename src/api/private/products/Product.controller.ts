import { honoApp } from '@/lib/utils/hono';
import { ProductCreateRoute, ProductDeleteRoute, ProductDetailRoute, ProductListRoute, ProductUpdateRoute } from 'src/api/private/products/Product.route';
import { ProductService } from './Product.service';
import { messages } from '@/lib/constants/messages';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
import { Meta } from '@/lib/dtos/Meta.dto';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { JwtPayload } from '@/lib/dtos/JwtPayload.dto';
import { RoleEnum } from '@/lib/enums/RoleEnum';
import { BadRequestException } from '@/lib/exceptions/BadRequestException';

const ProductController = honoApp()

ProductController.openapi(ProductListRoute, async (context) => {
  const query = context.req.valid('query')
  const jwt = new JwtPayload(context.get('jwtPayload'))
  const [products, totalData] = await ProductService.list(query, jwt.user);

  return context.json(new ApiResponseList({
    code: 200,
    messages: [messages.successList('product')],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: products
  }), 200)
})

ProductController.openapi(ProductDetailRoute, async (context) => {
  const param = context.req.valid('param')
  const jwtPayload = new JwtPayload(context.get('jwtPayload'))
  const product = await ProductService.get(+param.id, jwtPayload.user)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successDetail('product')],
    data: product
  }), 200)
})

ProductController.openapi(ProductCreateRoute, async (context) => {
  const payload = context.req.valid('json')
  const jwtPayload = new JwtPayload(context.get('jwtPayload'))

  if (jwtPayload.user.role !== RoleEnum.SuperAdmin && jwtPayload.user.branchId !== payload.branchId) {
    throw new BadRequestException('Requested Branch ID is not match with yours.')
  }

  const product = await ProductService.create(payload, jwtPayload.user)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successCreate(`Product with name ${product.name}`)],
    data: product
  }), 200)
})

ProductController.openapi(ProductUpdateRoute, async (context) => {
  const param = context.req.valid('param')
  const payload = context.req.valid('json')
  const jwtPayload = new JwtPayload(context.get('jwtPayload'))

  if (jwtPayload.user.role !== RoleEnum.SuperAdmin && jwtPayload.user.branchId !== payload.branchId) {
    throw new NotFoundException('Requested Product ID is not found in your branch\'s products.')
  }

  const product = await ProductService.update(+param.id, payload, jwtPayload.user)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [messages.successUpdate(`Product with ID ${product.id}`)],
    data: product
  }), 200)
})

ProductController.openapi(ProductDeleteRoute, async (context) => {
  const param = context.req.valid('param')
  const jwt = new JwtPayload(context.get('jwtPayload'))

  await ProductService.delete(+param.id, jwt.user)

  return context.json(new ApiResponse({
    code: 200,
    messages: [messages.successDelete(`Product with ID ${param.id}`)],
  }), 200)
})

export default ProductController
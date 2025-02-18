import { MESSAGES } from '@/lib/constants/MESSAGES';
import { honoApp } from '@/lib/hono';
import { CreateProductRoute } from '@/routes/products/CreateProductRoute';
import { DeleteProductRoute } from '@/routes/products/DeleteProductRoute';
import { DetailProductRoute } from '@/routes/products/DetailProductRoute';
import { ListProductRoute } from '@/routes/products/ListProductRoute';
import { UpdateProductRoute } from '@/routes/products/UpdateProductRoute';
import { ProductCreate } from '@/schemas/products/ProductCreateSchema';
import { ProductUpdate } from '@/schemas/products/ProductUpdateSchema';
import { ProductService } from '@/services/ProductService';

const ProductController = honoApp()

ProductController.openapi(ListProductRoute, async (context) => {
  const query = context.req.valid('query');

  const products = await ProductService.getList(query);
  const totalData = await ProductService.count(query);

  return context.json({
    code: 200,
    messages: MESSAGES.successList('produk'),
    data: products,
    meta: {
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      pageCount: Math.ceil(totalData / Number(query.pageSize)),
    }
  }, 200)
})

ProductController.openapi(DetailProductRoute, async (context) => {
  const param = context.req.valid('param');

  const item = await ProductService.get(param);

  return context.json({
    code: 200,
    messages: MESSAGES.successDetail('barang'),
    data: item,
  }, 200)
})

ProductController.openapi(CreateProductRoute, async (context) => {
  const payload = await context.req.json() as unknown as ProductCreate;
  await ProductService.create(payload);

  return context.json({
    code: 200,
    messages: MESSAGES.successCreate('produk'),
  }, 200)
})

ProductController.openapi(UpdateProductRoute, async (context) => {
  const param = context.req.valid('param');
  const payload = await context.req.json() as unknown as ProductUpdate;

  await ProductService.update(param, payload);

  return context.json({
    code: 200,
    messages: MESSAGES.successUpdate('produk'),
  }, 200)
})

ProductController.openapi(DeleteProductRoute, async (context) => {
  const param = context.req.valid('param');

  await ProductService.delete(param);

  return context.json({
    code: 200,
    messages: MESSAGES.successDelete('produk'),
  }, 200)
})

export default ProductController;
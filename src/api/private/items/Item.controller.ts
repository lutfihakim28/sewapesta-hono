import { honoApp } from '@/lib/utils/hono';
import { ItemListRoute } from './Item.routes';
import { ItemService } from './Item.service';
import { JwtPayload } from '@/lib/dtos/JwtPayload.dto';
import { ApiResponseList } from '@/lib/dtos/ApiResponse.dto';
import { Meta } from '@/lib/dtos/Meta.dto';

const ItemController = honoApp()

ItemController.openapi(ItemListRoute, async (context) => {
  const query = context.req.valid('query')
  const jwt = new JwtPayload(context.get('jwtPayload'))
  const [items, totalData] = await ItemService.list(jwt.user, query);

  return context.json(new ApiResponseList({
    code: 200,
    messages: ['Success'],
    meta: new Meta({
      page: query.page,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: items
  }), 200)
})

export default ItemController;
import { honoApp } from '@/utils/helpers/hono';
import { ProvinceRoute } from 'src/api/public/locations/provinces/Province.route';
import { ProvinceService } from './Province.service';
import { Meta } from '@/utils/dtos/Meta.dto';
import { ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { AcceptedLocale, tData, tMessage } from '@/utils/constants/locales/locale';

const ProvinceController = honoApp()

ProvinceController.openapi(ProvinceRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const query = context.req.valid('query')
  const [provinces, totalData] = await Promise.all([
    ProvinceService.list(query),
    ProvinceService.count(query)
  ])

  return context.json(new ApiResponseList({
    code: 200,
    messages: [
      tMessage({
        lang,
        key: 'successList',
        textCase: 'sentence',
        params: {
          data: tData({
            lang,
            key: 'province',
            mode: 'plural'
          })
        }
      })
    ],
    meta: new Meta({
      page: query.page!,
      pageSize: query.pageSize!,
      total: totalData
    }),
    data: provinces
  }), 200)
})

export default ProvinceController
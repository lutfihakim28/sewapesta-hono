import { honoApp } from '@/utils/helpers/hono';
import { ProvinceRoute } from 'src/api/public/locations/provinces/Province.route';
import { ProvinceService } from './Province.service';
import { Meta } from '@/utils/dtos/Meta.dto';
import { ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { AcceptedLocale, tData, tMessage } from '@/utils/constants/locales/locale';

const ProvinceController = honoApp()

ProvinceController.openapi(ProvinceRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const provinces = await ProvinceService.list()

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
      page: 1,
      pageSize: provinces.length,
      total: provinces.length
    }),
    data: provinces
  }), 200)
})

export default ProvinceController
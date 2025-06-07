import { honoApp } from '@/utils/helpers/hono';
import { Meta } from '@/utils/dtos/Meta.dto';
import { DistrictRoute } from 'src/api/public/locations/districts/District.route';
import { DistrictService } from './District.service';
import { ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { tMessage, tData, AcceptedLocale } from '@/utils/constants/locales/locale';

const DistrictController = honoApp()

DistrictController.openapi(DistrictRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const query = context.req.valid('query')
  const districts = await DistrictService.list(query);

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
            key: 'district',
            mode: 'plural'
          })
        }
      })
    ],
    meta: new Meta({
      page: 1,
      pageSize: districts.length,
      total: districts.length
    }),
    data: districts
  }), 200)
})

export default DistrictController
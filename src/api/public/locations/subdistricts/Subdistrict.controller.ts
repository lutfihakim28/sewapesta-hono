import { honoApp } from '@/utils/helpers/hono';
import { Meta } from '@/utils/dtos/Meta.dto';
import { SubdistrictRoute } from 'src/api/public/locations/subdistricts/Subdistrict.route';
import { SubdistrictService } from './Subdistrict.service';
import { ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { AcceptedLocale, tData, tMessage } from '@/utils/constants/locales/locale';

const SubdistrictController = honoApp()

SubdistrictController.openapi(SubdistrictRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const query = context.req.valid('query')
  const subdistricts = await SubdistrictService.list(query);

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
            key: 'subdistrict',
            mode: 'plural'
          })
        }
      })
    ],
    meta: new Meta({
      page: 1,
      pageSize: subdistricts.length,
      total: subdistricts.length
    }),
    data: subdistricts
  }), 200)
})

export default SubdistrictController
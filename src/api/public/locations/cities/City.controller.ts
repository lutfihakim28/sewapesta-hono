import { honoApp } from '@/utils/helpers/hono';
import { Meta } from '@/utils/dtos/Meta.dto';
import { CityRoute } from 'src/api/public/locations/cities/City.route';
import { CityService } from './City.service';
import { ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { AcceptedLocale, tData, tMessage } from '@/utils/constants/locales/locale';

const CityController = honoApp()

CityController.openapi(CityRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const cities = await CityService.list()

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
            key: 'city',
            mode: 'plural'
          })
        }
      })
    ],
    meta: new Meta({
      page: 1,
      pageSize: cities.length,
      total: cities.length
    }),
    data: cities
  }), 200)
})

export default CityController
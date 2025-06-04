import { honoApp } from '@/utils/helpers/hono';
import { EquipmentCreateRoute, EquipmentDeleteRoute, EquipmentDetailRoute, EquipmentListRoute, EquipmentUpdateRoute } from './Equipment.route';
import { ApiResponse, ApiResponseData, ApiResponseList } from '@/utils/dtos/ApiResponse.dto';
import { Meta } from '@/utils/dtos/Meta.dto';
import { EquipmentService } from './Equipment.service';
import { AcceptedLocale, tData, tMessage } from '@/utils/constants/locales/locale';
import { NotFoundException } from '@/utils/exceptions/NotFoundException';

const EquipmentController = honoApp()

EquipmentController.openapi(EquipmentListRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const query = context.req.valid('query')
  const [equipments, totalData] = await EquipmentService.list(query);

  return context.json(new ApiResponseList({
    code: 200,
    messages: [tMessage({
      lang,
      key: 'successList',
      textCase: 'sentence',
      params: {
        data: tData({
          lang,
          key: 'equipment',
          mode: 'plural'
        })
      }
    })],
    meta: new Meta({
      page: query.page,
      pageSize: query.pageSize,
      total: totalData
    }),
    data: equipments
  }), 200)
})

EquipmentController.openapi(EquipmentDetailRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')

  const equipment = await EquipmentService.get(+param.id)

  if (!equipment) {
    throw new NotFoundException('equipment', param.id)
  }

  return context.json(new ApiResponseData({
    code: 200,
    messages: [
      tMessage({
        lang,
        key: 'successDetail',
        textCase: 'sentence',
        params: {
          data: tData({
            lang,
            key: 'equipment'
          })
        }
      })
    ],
    data: equipment,
  }), 200)
})

EquipmentController.openapi(EquipmentCreateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale
  const payload = context.req.valid('json')

  const equipment = await EquipmentService.create(payload)

  return context.json(new ApiResponseData({
    code: 200,
    messages: [
      // messages.successCreate(`Equipment ${equipment.number}`)
      tMessage({
        lang,
        key: 'successCreate',
        textCase: 'sentence',
        params: {
          data: `${tData({
            lang,
            key: 'equipment',
          })} ${equipment.number}`
        }
      })
    ],
    data: equipment,
  }), 200)
})

EquipmentController.openapi(EquipmentUpdateRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')
  const payload = context.req.valid('json')

  const equipment = await EquipmentService.update(+param.id, payload)

  if (!equipment) {
    throw new NotFoundException('equipment', param.id)
  }

  return context.json(new ApiResponseData({
    code: 200,
    messages: [
      tMessage({
        lang,
        key: 'successUpdate',
        textCase: 'sentence',
        params: {
          data: tData({
            lang,
            key: 'withId',
            params: {
              data: tData({
                lang,
                key: 'equipment',
              }),
              value: param.id
            }
          })
        }
      })
    ],
    data: equipment,
  }), 200)
})

EquipmentController.openapi(EquipmentDeleteRoute, async (context) => {
  const lang = context.get('language') as AcceptedLocale;
  const param = context.req.valid('param')

  await EquipmentService.delete(+param.id)

  return context.json(new ApiResponse({
    code: 200,
    messages: [tMessage({
      lang,
      key: 'successDelete',
      textCase: 'sentence',
      params: {
        data: tData({
          lang,
          key: 'withId',
          params: {
            data: tData({
              lang,
              key: 'equipment',
            }),
            value: param.id
          }
        })
      }
    })]
  }), 200)
})

export default EquipmentController;
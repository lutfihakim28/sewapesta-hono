import { MESSAGES } from '@/lib/constants/MESSAGES';
import { honoApp } from '@/lib/hono';
import { CreateUnitRoute } from '@/routes/units/CreateUnitRoute';
import { DeleteUnitRoute } from '@/routes/units/DeleteUnitRoute';
import { ListUnitRoute } from '@/routes/units/ListUnitRoute';
import { UpdateUnitRoute } from '@/routes/units/UpdateUnitRoute';
import { UnitService } from '@/services/UnitService';

const UnitController = honoApp();

UnitController.openapi(ListUnitRoute, async (context) => {
  const categories = await UnitService.getList();

  return context.json({
    code: 200,
    messages: MESSAGES.successList('satuan'),
    data: categories,
  }, 200)
})

UnitController.openapi(CreateUnitRoute, async (context) => {
  const payload = context.req.valid('json');

  await UnitService.create(payload);

  return context.json({
    code: 200,
    messages: MESSAGES.successCreate('satuan'),
  }, 200)
})

UnitController.openapi(UpdateUnitRoute, async (context) => {
  const payload = context.req.valid('json');
  const param = context.req.valid('param');

  await UnitService.update(param, payload);

  return context.json({
    code: 200,
    messages: MESSAGES.successUpdate('satuan'),
  }, 200)
})

UnitController.openapi(DeleteUnitRoute, async (context) => {
  const param = context.req.valid('param');

  await UnitService.delete(param);

  return context.json({
    code: 200,
    messages: MESSAGES.successDelete('satuan'),
  }, 200)
})

export default UnitController;
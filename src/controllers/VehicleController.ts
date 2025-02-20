import { messages } from '@/lib/constants/messages';
import { honoApp } from '@/lib/hono';
import { CreateVehicleRoute } from '@/routes/vehicles/CreateVehicleRoute';
import { DeleteVehicleRoute } from '@/routes/vehicles/DeleteVehicleRoute';
import { ListVehicleRoute } from '@/routes/vehicles/ListVehicleRoute';
import { UpdateVehicleRoute } from '@/routes/vehicles/UpdateVehicleRoute';
import { VehicleService } from '@/services/VehicleService';

const VehicleController = honoApp()

VehicleController.openapi(ListVehicleRoute, async (context) => {
  const vehicles = await VehicleService.getList();
  return context.json({
    code: 200,
    messages: messages.successList('kendaraan'),
    data: vehicles,
  }, 200)
})

VehicleController.openapi(CreateVehicleRoute, async (context) => {
  const payload = context.req.valid('json');
  await VehicleService.create(payload);
  return context.json({
    code: 200,
    messages: messages.successCreate('kendaraan'),
  }, 200)
})

VehicleController.openapi(UpdateVehicleRoute, async (context) => {
  const param = context.req.valid('param');
  const payload = context.req.valid('json');
  await VehicleService.update(param, payload);
  return context.json({
    code: 200,
    messages: messages.successUpdate('kendaraan'),
  }, 200)
})

VehicleController.openapi(DeleteVehicleRoute, async (context) => {
  const param = context.req.valid('param');
  await VehicleService.delete(param);
  return context.json({
    code: 200,
    messages: messages.successDelete('kendaraan'),
  }, 200)
})

export default VehicleController
import { messages } from '@/constatnts/messages';
import { honoApp } from '@/lib/hono';
import { CreateVehicleRoute, DeleteVehicleRoute, DetailVehicleRoute, ListVehicleRoute, UpdateVehicleRoute } from '@/routes/VehicleRoute';
import { VehicleService } from '@/services/VehicleService';

const VehicleController = honoApp()

VehicleController.openapi(ListVehicleRoute, async (context) => {
  const vehicles = await VehicleService.getList();
  return context.json({
    code: 200,
    messages: [messages.successList('kendaraan')],
    data: vehicles,
  }, 200)
})

VehicleController.openapi(DetailVehicleRoute, async (context) => {
  const param = context.req.valid('param');
  const vehicle = await VehicleService.get(param);
  return context.json({
    code: 200,
    messages: [messages.successDetail('kendaraan')],
    data: vehicle,
  }, 200)
})

VehicleController.openapi(CreateVehicleRoute, async (context) => {
  const payload = context.req.valid('json');
  const vehicle = await VehicleService.create(payload);
  return context.json({
    code: 200,
    messages: [messages.successCreate('kendaraan')],
    data: vehicle,
  }, 200)
})

VehicleController.openapi(UpdateVehicleRoute, async (context) => {
  const param = context.req.valid('param');
  const payload = context.req.valid('json');
  const vehicle = await VehicleService.update(param, payload);
  return context.json({
    code: 200,
    messages: [messages.successUpdate('kendaraan')],
    data: vehicle,
  }, 200)
})

VehicleController.openapi(DeleteVehicleRoute, async (context) => {
  const param = context.req.valid('param');
  await VehicleService.delete(param);
  return context.json({
    code: 200,
    messages: [messages.successDelete('kendaraan')],
  }, 200)
})

export default VehicleController
import { honoApp } from '@/lib/hono';
import { CreateEmployeeRoute, DeleteEmployeeRoute, DetailEmployeeRoute, ListEmployeeRoute, UpdateEmployeeRoute } from '@/routes/EmployeeRoute';
import { EmployeeService } from '@/services/EmployeeService';

const EmployeeController = honoApp()

EmployeeController.openapi(ListEmployeeRoute, async (context) => {
  const employees = await EmployeeService.getList();

  return context.json({
    code: 200,
    messages: ['Berhasil mendapatkan daftar karyawan.'],
    data: employees,
  }, 200)
})

EmployeeController.openapi(DetailEmployeeRoute, async (context) => {
  const param = context.req.valid('param');

  const employee = await EmployeeService.get(param);

  return context.json({
    code: 200,
    messages: ['Berhasil mendapatkan detail karyawan.'],
    data: employee,
  }, 200)
})

EmployeeController.openapi(CreateEmployeeRoute, async (context) => {
  const payload = context.req.valid('json');

  const employee = await EmployeeService.create(payload);

  return context.json({
    code: 200,
    messages: ['Berhasil menambah karyawan.'],
    data: employee,
  }, 200)
})

EmployeeController.openapi(UpdateEmployeeRoute, async (context) => {
  const param = context.req.valid('param');
  const payload = context.req.valid('json');

  const employee = await EmployeeService.update(param, payload);

  return context.json({
    code: 200,
    messages: ['Berhasil mengubah karyawan.'],
    data: employee,
  }, 200)
})

EmployeeController.openapi(DeleteEmployeeRoute, async (context) => {
  const param = context.req.valid('param');

  const employee = await EmployeeService.delete(param);

  return context.json({
    code: 200,
    messages: ['Berhasil menghapus karyawan.'],
    data: employee,
  }, 200)
})

export default EmployeeController;
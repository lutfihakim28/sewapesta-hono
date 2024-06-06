import { messages } from '@/constatnts/messages';
import { honoApp } from '@/lib/hono';
import { CreateEmployeeRoute, DeleteEmployeeRoute, DetailEmployeeRoute, ListEmployeeRoute, UpdateEmployeeRoute } from '@/routes/EmployeeRoute';
import { EmployeeService } from '@/services/EmployeeService';

const EmployeeController = honoApp()

EmployeeController.openapi(ListEmployeeRoute, async (context) => {
  const query = context.req.valid('query');

  const employees = await EmployeeService.getList(query);
  const totalData = await EmployeeService.count(query);

  return context.json({
    code: 200,
    messages: [messages.successList('karyawan')],
    data: employees,
    meta: {
      page: Number(query.page),
      limit: Number(query.limit),
      totalPage: Math.ceil(totalData / Number(query.limit)),
    }
  }, 200)
})

EmployeeController.openapi(DetailEmployeeRoute, async (context) => {
  const param = context.req.valid('param');

  const employee = await EmployeeService.get(param);

  return context.json({
    code: 200,
    messages: [messages.successDetail('karyawan')],
    data: employee,
  }, 200)
})

EmployeeController.openapi(CreateEmployeeRoute, async (context) => {
  const payload = context.req.valid('json');

  const employee = await EmployeeService.create(payload);

  return context.json({
    code: 200,
    messages: [messages.successCreate('karyawan')],
    data: employee,
  }, 200)
})

EmployeeController.openapi(UpdateEmployeeRoute, async (context) => {
  const param = context.req.valid('param');
  const payload = context.req.valid('json');

  const employee = await EmployeeService.update(param, payload);

  return context.json({
    code: 200,
    messages: [messages.successUpdate('karyawan')],
    data: employee,
  }, 200)
})

EmployeeController.openapi(DeleteEmployeeRoute, async (context) => {
  const param = context.req.valid('param');

  await EmployeeService.delete(param);

  return context.json({
    code: 200,
    messages: [messages.successDelete('karyawan')],
  }, 200)
})

export default EmployeeController;
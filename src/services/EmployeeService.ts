import { db } from '@/db';
import { employeesTable } from '@/db/schema/employees';
import { ParamId } from '@/schemas/ParamIdSchema';
import { EmployeeRequest } from '@/schemas/employees/EmployeeRequestSchema';
import { EmployeeResponse } from '@/schemas/employees/EmployeeResponseSchema';
import { ExtendedEmployeeResponse } from '@/schemas/employees/ExtendedEmployeeResponseSchema';
import { and, eq, isNull } from 'drizzle-orm';
import { AccountService } from './AccountService';
import dayjs from 'dayjs';

export abstract class EmployeeService {
  static async getList(): Promise<Array<ExtendedEmployeeResponse>> {
    const employees = db.query.employeesTable.findMany({
      where: isNull(employeesTable.deletedAt),
      with: {
        account: true
      }
    })

    return employees;
  }

  static async get(param: ParamId): Promise<ExtendedEmployeeResponse | undefined> {
    const employee = db.query.employeesTable.findFirst({
      where: and(
        eq(employeesTable.id, Number(param.id)),
        isNull(employeesTable.deletedAt),
      ),
      with: {
        account: true
      }
    })

    return employee;
  }

  static async create(request: EmployeeRequest): Promise<EmployeeResponse> {
    const createdAt = dayjs().unix();
    const accountId = await AccountService.create({
      name: request.name,
    })
    const employee = db
      .insert(employeesTable)
      .values({
        ...request,
        accountId,
        createdAt,
      })
      .returning()
      .get()

    return employee
  }

  static async update(param: ParamId, request: EmployeeRequest): Promise<EmployeeResponse> {
    const updatedAt = dayjs().unix();
    const employee = db
      .update(employeesTable)
      .set({
        ...request,
        updatedAt,
      })
      .where(and(
        eq(employeesTable.id, Number(param.id)),
        isNull(employeesTable.deletedAt),
      ))
      .returning()
      .get()

    return employee;
  }

  static async delete(param: ParamId) {
    const deletedAt = dayjs().unix();
    await AccountService.delete(param)
    await db
      .update(employeesTable)
      .set({
        deletedAt,
      })
      .where(and(
        eq(employeesTable.id, Number(param.id)),
        isNull(employeesTable.deletedAt),
      ))
  }
}
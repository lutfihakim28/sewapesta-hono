import { db } from '@/db';
import { employeesTable } from '@/db/schema/employees';
import { ParamId } from '@/schemas/ParamIdSchema';
import { EmployeeRequest } from '@/schemas/employees/EmployeeRequestSchema';
import { EmployeeResponse } from '@/schemas/employees/EmployeeResponseSchema';
import { ExtendedEmployeeResponse } from '@/schemas/employees/ExtendedEmployeeResponseSchema';
import { and, eq, isNull } from 'drizzle-orm';
import { AccountService } from './AccountService';
import dayjs from 'dayjs';
import { NotFoundException } from '@/exceptions/NotFoundException';

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

    if (!employee) {
      throw new NotFoundException('Karyawan tidak ditemukan.')
    }

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
    const employee = db.transaction(async (transaction) => {
      const existingEmployeeId = await this.checkRecord(param);

      const newEmployee = transaction
        .update(employeesTable)
        .set({
          ...request,
          updatedAt,
        })
        .where(and(
          eq(employeesTable.id, existingEmployeeId),
          isNull(employeesTable.deletedAt),
        ))
        .returning()
        .get()

      return newEmployee
    })

    return employee;
  }

  static async delete(param: ParamId) {
    const deletedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingEmployeeId = await this.checkRecord(param)
      await AccountService.delete(param)
      await transaction
        .update(employeesTable)
        .set({
          deletedAt,
        })
        .where(and(
          eq(employeesTable.id, existingEmployeeId),
          isNull(employeesTable.deletedAt),
        ))
    })
  }

  static async checkRecord(param: ParamId) {
    const employee = db
      .select({ id: employeesTable.id })
      .from(employeesTable)
      .where(and(
        eq(employeesTable.id, Number(param.id)),
        isNull(employeesTable.deletedAt)
      ))
      .get();


    if (!employee) {
      throw new NotFoundException('Karyawan tidak ditemukan.')
    }

    return employee.id
  }
}
import { db } from '@/db';
import { employeesTable } from '@/db/schema/employees';
import { ParamId } from '@/schemas/ParamIdSchema';
import { EmployeeRequest } from '@/schemas/employees/EmployeeRequestSchema';
import { EmployeeResponse } from '@/schemas/employees/EmployeeResponseSchema';
import { ExtendedEmployeeResponse } from '@/schemas/employees/ExtendedEmployeeResponseSchema';
import { and, asc, count, desc, eq, isNull, like, or } from 'drizzle-orm';
import { AccountService } from './AccountService';
import dayjs from 'dayjs';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { messages } from '@/constatnts/messages';
import { EmployeeColumn, EmployeeFilter } from '@/schemas/employees/EmployeeFilterSchema';
import { countOffset } from '@/utils/countOffset';

export abstract class EmployeeService {
  static async getList(query: EmployeeFilter): Promise<Array<ExtendedEmployeeResponse>> {
    let sort: 'asc' | 'desc' = 'asc';
    let sortBy: EmployeeColumn = 'id';

    if (query.sort) {
      sort = query.sort
    }

    if (query.sortBy) {
      sortBy = query.sortBy
    }

    const employees = db.query.employeesTable.findMany({
      with: {
        account: true
      },
      where: and(
        isNull(employeesTable.deletedAt),
        query.keyword
          ? or(
            like(employeesTable.name, `%${query.keyword}%`),
            like(employeesTable.phone, `%${query.keyword}%`)
          )
          : undefined,
      ),
      orderBy: sort === 'asc'
        ? asc(employeesTable[sortBy])
        : desc(employeesTable[sortBy]),
      limit: Number(query.limit || 5),
      offset: countOffset(query.page, query.limit)
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
      throw new NotFoundException(messages.errorNotFound('karyawan'))
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
      throw new NotFoundException(messages.errorNotFound('karyawan'))
    }

    return employee.id
  }

  static async count(query: EmployeeFilter): Promise<number> {
    const employee = db
      .select({ count: count() })
      .from(employeesTable)
      .where(and(
        isNull(employeesTable.deletedAt),
        query.keyword
          ? or(
            like(employeesTable.name, `%${query.keyword}%`),
            like(employeesTable.phone, `%${query.keyword}%`)
          )
          : undefined,
      ))
      .get();

    return employee ? employee.count : 0;
  }
}
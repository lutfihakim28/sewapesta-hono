import { db } from 'db';
import { employeesTable } from 'db/schema/employees';
import { ParamId } from '@/schemas/ParamIdSchema';
import { EmployeeRequest } from '@/schemas/employees/EmployeeRequestSchema';
import { and, asc, count, desc, eq, isNull, like, or } from 'drizzle-orm';
import { AccountService } from './AccountService';
import dayjs from 'dayjs';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { messages } from '@/constatnts/messages';
import { EmployeeColumn, EmployeeFilter } from '@/schemas/employees/EmployeeFilterSchema';
import { countOffset } from '@/utils/countOffset';
import { Employee } from '@/schemas/employees/EmployeeSchema';
import { dateFormat } from '@/constatnts/dateFormat';

export abstract class EmployeeService {
  static async getList(query: EmployeeFilter): Promise<Array<Employee>> {
    let sort: 'asc' | 'desc' = 'asc';
    let sortBy: EmployeeColumn = 'id';

    if (query.sort) {
      sort = query.sort
    }

    if (query.sortBy) {
      sortBy = query.sortBy
    }

    const employees = await db.query.employeesTable.findMany({
      columns: {
        id: true,
        name: true,
        phone: true,
      },
      with: {
        account: {
          columns: {
            balance: true,
            id: true,
            name: true,
            updatedAt: true,
          }
        }
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

  static async get(param: ParamId): Promise<Employee> {
    const employee = await db.query.employeesTable.findFirst({
      columns: {
        id: true,
        name: true,
        phone: true,
      },
      where: and(
        eq(employeesTable.id, Number(param.id)),
        isNull(employeesTable.deletedAt),
      ),
    })

    if (!employee) {
      throw new NotFoundException(messages.errorNotFound('karyawan'))
    }

    return employee;
  }

  static async create(request: EmployeeRequest): Promise<void> {
    const createdAt = dayjs().unix();
    const accountId = await AccountService.create({
      name: request.name,
    })
    await db
      .insert(employeesTable)
      .values({
        ...request,
        accountId,
        createdAt,
      })
  }

  static async update(param: ParamId, request: EmployeeRequest): Promise<void> {
    const updatedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingEmployeeId = await this.checkRecord(param);

      await transaction
        .update(employeesTable)
        .set({
          ...request,
          updatedAt,
        })
        .where(and(
          eq(employeesTable.id, existingEmployeeId),
          isNull(employeesTable.deletedAt),
        ))
    })
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
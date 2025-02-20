import { db } from 'db';
import { employees } from 'db/schema/employees';
import { ParamId } from '@/schemas/ParamIdSchema';
import { EmployeeRequest } from '@/schemas/employees/EmployeeRequestSchema';
import { and, asc, count, desc, eq, isNull, like, or } from 'drizzle-orm';
import dayjs from 'dayjs';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { messages } from '@/lib/constants/messages';
import { EmployeeColumn, EmployeeFilter } from '@/schemas/employees/EmployeeFilterSchema';
import { countOffset } from '@/lib/utils/countOffset';
import { Employee } from '@/schemas/employees/EmployeeSchema';

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

    const _employees = await db.query.employees.findMany({
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
        isNull(employees.deletedAt),
        query.keyword
          ? or(
            like(employees.name, `%${query.keyword}%`),
            like(employees.phone, `%${query.keyword}%`)
          )
          : undefined,
      ),
      orderBy: sort === 'asc'
        ? asc(employees[sortBy])
        : desc(employees[sortBy]),
      limit: Number(query.pageSize || 5),
      offset: countOffset(query.page, query.pageSize)
    })

    return _employees;
  }

  static async get(param: ParamId): Promise<Employee> {
    const employee = await db.query.employees.findFirst({
      columns: {
        id: true,
        name: true,
        phone: true,
      },
      where: and(
        eq(employees.id, Number(param.id)),
        isNull(employees.deletedAt),
      ),
    })

    if (!employee) {
      throw new NotFoundException(messages.errorNotFound('karyawan'))
    }

    return employee;
  }

  static async create(request: EmployeeRequest): Promise<void> {
    const createdAt = dayjs().unix();
    await db
      .insert(employees)
      .values({
        ...request,
        createdAt,
      })
  }

  static async update(param: ParamId, request: EmployeeRequest): Promise<void> {
    const updatedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingEmployee = await this.get(param);

      await transaction
        .update(employees)
        .set({
          ...request,
          updatedAt,
        })
        .where(and(
          eq(employees.id, existingEmployee.id),
          isNull(employees.deletedAt),
        ))
    })
  }

  static async delete(param: ParamId) {
    const deletedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingEmployee = await this.get(param)
      await transaction
        .update(employees)
        .set({
          deletedAt,
        })
        .where(and(
          eq(employees.id, existingEmployee.id),
          isNull(employees.deletedAt),
        ))
    })
  }

  static async count(query: EmployeeFilter): Promise<number> {
    const employee = db
      .select({ count: count() })
      .from(employees)
      .where(and(
        isNull(employees.deletedAt),
        query.keyword
          ? or(
            like(employees.name, `%${query.keyword}%`),
            like(employees.phone, `%${query.keyword}%`)
          )
          : undefined,
      ))
      .get();

    return employee ? employee.count : 0;
  }
}
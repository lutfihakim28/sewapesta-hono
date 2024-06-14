import { db } from 'db';
import { ParamId } from '@/schemas/ParamIdSchema';
import { and, asc, count, desc, eq, isNull, like, or } from 'drizzle-orm';
import { AccountService } from './AccountService';
import dayjs from 'dayjs';
import { ownersTable } from 'db/schema/owners';
import { OwnerRequest } from '@/schemas/owners/OwnerRequestSchema';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { messages } from '@/constatnts/messages';
import { OwnerColumn, OwnerFilter } from '@/schemas/owners/OwnerFilterScheme';
import { countOffset } from '@/utils/countOffset';
import { Owner } from '@/schemas/owners/OwnerSchema';
import { dateFormat } from '@/constatnts/dateFormat';

export abstract class OwnerService {
  static async getList(query: OwnerFilter): Promise<Array<Owner>> {
    let sort: 'asc' | 'desc' = 'asc';
    let sortBy: OwnerColumn = 'id';

    if (query.sort) {
      sort = query.sort
    }

    if (query.sortBy) {
      sortBy = query.sortBy
    }

    const owners = await db.query.ownersTable.findMany({
      columns: {
        id: true,
        name: true,
        phone: true,
      },
      where: and(
        isNull(ownersTable.deletedAt),
        query.type
          ? eq(ownersTable.type, query.type)
          : undefined,
        query.keyword
          ? or(
            like(ownersTable.name, `%${query.keyword}%`),
            like(ownersTable.phone, `%${query.keyword}%`)
          )
          : undefined,
      ),
      orderBy: sort === 'asc'
        ? asc(ownersTable[sortBy])
        : desc(ownersTable[sortBy]),
      limit: Number(query.limit || 5),
      offset: countOffset(query.page, query.limit)
    })

    return owners;
  }

  static async get(param: ParamId): Promise<Owner> {
    const owner = await db.query.ownersTable.findFirst({
      columns: {
        id: true,
        name: true,
        phone: true,
      },
      where: and(
        eq(ownersTable.id, Number(param.id)),
        isNull(ownersTable.deletedAt),
      ),
    })

    if (!owner) {
      throw new NotFoundException(messages.errorNotFound('Pemilik'))
    }

    return owner
  }

  static async create(request: OwnerRequest): Promise<void> {
    const createdAt = dayjs().unix();
    const accountId = await AccountService.create({
      name: request.name,
    })
    await db
      .insert(ownersTable)
      .values({
        ...request,
        accountId,
        createdAt,
      })
  }

  static async update(param: ParamId, request: OwnerRequest): Promise<void> {
    const updatedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingOwnerId = await this.checkRecord(param);
      await transaction
        .update(ownersTable)
        .set({
          ...request,
          updatedAt,
        })
        .where(and(
          eq(ownersTable.id, existingOwnerId),
          isNull(ownersTable.deletedAt),
        ))
    })
  }

  static async delete(param: ParamId) {
    const deletedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingOwnerId = await this.checkRecord(param);
      await AccountService.delete(param)
      await transaction
        .update(ownersTable)
        .set({
          deletedAt,
        })
        .where(and(
          eq(ownersTable.id, existingOwnerId),
          isNull(ownersTable.deletedAt),
        ))
    })
  }

  static async checkRecord(param: ParamId) {
    const owner = db
      .select({ id: ownersTable.id })
      .from(ownersTable)
      .where(and(
        eq(ownersTable.id, Number(param.id)),
        isNull(ownersTable.deletedAt)
      ))
      .get();


    if (!owner) {
      throw new NotFoundException('Pemilik tidak ditemukan.')
    }

    return owner.id
  }

  static async count(query: OwnerFilter): Promise<number> {
    const owner = db
      .select({ count: count() })
      .from(ownersTable)
      .where(and(
        isNull(ownersTable.deletedAt),
        query.keyword
          ? or(
            like(ownersTable.name, `%${query.keyword}%`),
            like(ownersTable.phone, `%${query.keyword}%`)
          )
          : undefined,
      ))
      .get();

    return owner ? owner.count : 0;
  }
}
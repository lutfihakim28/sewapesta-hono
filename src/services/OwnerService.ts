import { db } from '@/db';
import { ParamId } from '@/schemas/ParamIdSchema';
import { and, asc, count, desc, eq, isNull, like, or } from 'drizzle-orm';
import { AccountService } from './AccountService';
import dayjs from 'dayjs';
import { ExtendedOwnerResponse } from '@/schemas/owners/ExtendedOwnerResponseSchema';
import { ownersTable } from '@/db/schema/owners';
import { OwnerRequest } from '@/schemas/owners/OwnerRequestSchema';
import { OwnerResponse } from '@/schemas/owners/OwnerResponseSchema';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { messages } from '@/constatnts/messages';
import { OwnerColumn, OwnerFilter } from '@/schemas/owners/OwnerFilterScheme';
import { countOffset } from '@/utils/countOffset';

export abstract class OwnerService {
  static async getList(query: OwnerFilter): Promise<Array<ExtendedOwnerResponse>> {
    let sort: 'asc' | 'desc' = 'asc';
    let sortBy: OwnerColumn = 'id';

    if (query.sort) {
      sort = query.sort
    }

    if (query.sortBy) {
      sortBy = query.sortBy
    }

    const owners = db.query.ownersTable.findMany({
      with: {
        account: true
      },
      where: and(
        isNull(ownersTable.deletedAt),
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

  static async get(param: ParamId): Promise<ExtendedOwnerResponse | undefined> {
    const owner = db.query.ownersTable.findFirst({
      where: and(
        eq(ownersTable.id, Number(param.id)),
        isNull(ownersTable.deletedAt),
      ),
      with: {
        account: true
      }
    })

    if (!owner) {
      throw new NotFoundException(messages.errorNotFound('Pemilik'))
    }

    return owner;
  }

  static async create(request: OwnerRequest): Promise<OwnerResponse> {
    const createdAt = dayjs().unix();
    const accountId = await AccountService.create({
      name: request.name,
    })
    const owner = db
      .insert(ownersTable)
      .values({
        ...request,
        accountId,
        createdAt,
      })
      .returning()
      .get()

    return owner
  }

  static async update(param: ParamId, request: OwnerRequest): Promise<OwnerResponse> {
    const updatedAt = dayjs().unix();
    const owner = await db.transaction(async (transaction) => {
      const existingOwnerId = await this.checkRecord(param);
      const newOwner = transaction
        .update(ownersTable)
        .set({
          ...request,
          updatedAt,
        })
        .where(and(
          eq(ownersTable.id, existingOwnerId),
          isNull(ownersTable.deletedAt),
        ))
        .returning()
        .get()

      return newOwner;
    })


    return owner;
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
import { db } from 'db';
import { ParamId } from '@/schemas/ParamIdSchema';
import { and, asc, count, desc, eq, isNull, like, or } from 'drizzle-orm';
import dayjs from 'dayjs';
import { owners } from 'db/schema/owners';
import { OwnerRequest } from '@/schemas/owners/OwnerRequestSchema';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { messages } from '@/constatnts/messages';
import { OwnerColumn, OwnerFilter } from '@/schemas/owners/OwnerFilterScheme';
import { countOffset } from '@/utils/countOffset';
import { Owner } from '@/schemas/owners/OwnerSchema';
import { Option, OptionQuery } from '@/schemas/OptionSchema';

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

    const _owners = await db.query.owners.findMany({
      columns: {
        id: true,
        name: true,
        phone: true,
        type: true,
      },
      where: and(
        isNull(owners.deletedAt),
        query.type
          ? eq(owners.type, query.type)
          : undefined,
        query.keyword
          ? or(
            like(owners.name, `%${query.keyword}%`),
            like(owners.phone, `%${query.keyword}%`)
          )
          : undefined,
      ),
      orderBy: sort === 'asc'
        ? asc(owners[sortBy])
        : desc(owners[sortBy]),
      limit: Number(query.pageSize || 5),
      offset: countOffset(query.page, query.pageSize)
    })

    return _owners;
  }

  static async get(param: ParamId): Promise<Owner> {
    const owner = await db.query.owners.findFirst({
      columns: {
        id: true,
        name: true,
        phone: true,
        type: true,
      },
      where: and(
        eq(owners.id, Number(param.id)),
        isNull(owners.deletedAt),
      ),
    })

    if (!owner) {
      throw new NotFoundException(messages.errorNotFound('Pemilik'))
    }

    return owner
  }

  static async create(request: OwnerRequest): Promise<void> {
    const createdAt = dayjs().unix();
    await db
      .insert(owners)
      .values({
        ...request,
        createdAt,
      })
  }

  static async update(param: ParamId, request: OwnerRequest): Promise<void> {
    const updatedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingOwner = await this.get(param);
      await transaction
        .update(owners)
        .set({
          ...request,
          updatedAt,
        })
        .where(and(
          eq(owners.id, existingOwner.id),
          isNull(owners.deletedAt),
        ))
    })
  }

  static async delete(param: ParamId) {
    const deletedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingOwner = await this.get(param);
      await transaction
        .update(owners)
        .set({
          deletedAt,
        })
        .where(and(
          eq(owners.id, existingOwner.id),
          isNull(owners.deletedAt),
        ))
    })
  }

  static async getOptions(query: OptionQuery): Promise<Array<Option>> {
    const options = await db
      .select({
        label: owners.name,
        value: owners.id,
      })
      .from(owners)
      .where(and(
        isNull(owners.deletedAt),
        query.keyword
          ? like(owners.name, `%${query.keyword}%`)
          : undefined
      ))

    return options;
  }

  static async count(query: OwnerFilter): Promise<number> {
    const owner = db
      .select({ count: count() })
      .from(owners)
      .where(and(
        isNull(owners.deletedAt),
        query.keyword
          ? or(
            like(owners.name, `%${query.keyword}%`),
            like(owners.phone, `%${query.keyword}%`)
          )
          : undefined,
      ))
      .get();

    return owner ? owner.count : 0;
  }
}
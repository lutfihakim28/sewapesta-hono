import { db } from '@/db';
import { ParamId } from '@/schemas/ParamIdSchema';
import { and, eq, isNull } from 'drizzle-orm';
import { AccountService } from './AccountService';
import dayjs from 'dayjs';
import { ExtendedOwnerResponse } from '@/schemas/owners/ExtendedOwnerResponseSchema';
import { ownersTable } from '@/db/schema/owners';
import { OwnerRequest } from '@/schemas/owners/OwnerRequestSchema';
import { OwnerResponse } from '@/schemas/owners/OwnerResponseSchema';

export abstract class OwnerService {
  static async getList(): Promise<Array<ExtendedOwnerResponse>> {
    const owners = db.query.ownersTable.findMany({
      where: isNull(ownersTable.deletedAt),
      with: {
        account: true
      }
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
    const owner = db
      .update(ownersTable)
      .set({
        ...request,
        updatedAt,
      })
      .where(and(
        eq(ownersTable.id, Number(param.id)),
        isNull(ownersTable.deletedAt),
      ))
      .returning()
      .get()

    return owner;
  }

  static async delete(param: ParamId) {
    const deletedAt = dayjs().unix();
    await AccountService.delete(param)
    await db
      .update(ownersTable)
      .set({
        deletedAt,
      })
      .where(and(
        eq(ownersTable.id, Number(param.id)),
        isNull(ownersTable.deletedAt),
      ))
  }
}
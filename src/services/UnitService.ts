import { messages } from '@/constatnts/messages';
import { db } from 'db';
import { unitsTable } from 'db/schema/units';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { ParamId } from '@/schemas/ParamIdSchema';
import { UnitRequest } from '@/schemas/units/UnitRequestSchema';
import { Unit } from '@/schemas/units/UnitSchema';
import dayjs from 'dayjs';
import { and, eq, isNull } from 'drizzle-orm';

export abstract class UnitService {
  static async getList(): Promise<Array<Unit>> {
    const units = db.query.unitsTable.findMany({
      columns: {
        id: true,
        name: true,
      },
      where: (table, { isNull }) => isNull(table.deletedAt),
    })

    return units
  }

  static async create(request: UnitRequest) {
    const createdAt = dayjs().unix();
    await db.insert(unitsTable).values({
      ...request,
      createdAt
    })
  }

  static async update(param: ParamId, request: UnitRequest) {
    await db.transaction(async (transaction) => {
      const unit = await this.checkRecord(param);

      await transaction
        .update(unitsTable)
        .set(request)
        .where(eq(unitsTable.id, unit.id))
    })
  }

  static async delete(param: ParamId) {
    await db.transaction(async (transaction) => {
      const unit = await this.checkRecord(param);

      await transaction
        .update(unitsTable)
        .set({
          deletedAt: dayjs().unix(),
        })
        .where(eq(unitsTable.id, unit.id))
    })
  }

  static async checkRecord(param: ParamId) {
    const unit = db
      .select({
        id: unitsTable.id,
      })
      .from(unitsTable)
      .where(and(
        isNull(unitsTable.deletedAt),
        eq(unitsTable.id, Number(param.id))
      ))
      .get();

    if (!unit) {
      throw new NotFoundException(messages.errorNotFound('satuan'))
    }

    return unit
  }
}
import { messages } from '@/constants/message';
import { db } from 'db';
import { units } from 'db/schema/units';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { ParamId } from '@/schemas/ParamIdSchema';
import { UnitRequest } from '@/schemas/units/UnitRequestSchema';
import { Unit } from '@/schemas/units/UnitSchema';
import dayjs from 'dayjs';
import { and, eq, isNull } from 'drizzle-orm';

export abstract class UnitService {
  static async getList(): Promise<Array<Unit>> {
    const _units = db.query.units.findMany({
      columns: {
        id: true,
        name: true,
      },
      where: isNull(units.deletedAt),
    })

    return _units
  }

  static async create(request: UnitRequest) {
    const createdAt = dayjs().unix();
    await db.insert(units).values({
      ...request,
      createdAt
    })
  }

  static async update(param: ParamId, request: UnitRequest) {
    await db.transaction(async (transaction) => {
      const unit = await this.checkRecord(param);

      await transaction
        .update(units)
        .set(request)
        .where(eq(units.id, unit.id))
    })
  }

  static async delete(param: ParamId) {
    await db.transaction(async (transaction) => {
      const unit = await this.checkRecord(param);

      await transaction
        .update(units)
        .set({
          deletedAt: dayjs().unix(),
        })
        .where(eq(units.id, unit.id))
    })
  }

  static async checkRecord(param: ParamId) {
    const unit = db
      .select({
        id: units.id,
      })
      .from(units)
      .where(and(
        isNull(units.deletedAt),
        eq(units.id, Number(param.id))
      ))
      .get();

    if (!unit) {
      throw new NotFoundException(messages.errorNotFound('satuan'))
    }

    return unit
  }
}
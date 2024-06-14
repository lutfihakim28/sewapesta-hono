import { messages } from '@/constatnts/messages';
import { db } from 'db';
import { vehiclesTable } from 'db/schema/vehicles';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { ParamId } from '@/schemas/ParamIdSchema';
import { VehicleRequest } from '@/schemas/vehicles/VehicleRequestSchema';
import { Vehicle } from '@/schemas/vehicles/VehicleSchema';
import dayjs from 'dayjs';
import { and, eq, isNull } from 'drizzle-orm';

export abstract class VehicleService {
  static async getList(): Promise<Array<Vehicle>> {
    const vehicles = db
      .select()
      .from(vehiclesTable)
      .where(isNull(vehiclesTable.deletedAt))
      .all()

    return vehicles;
  }

  static async get(param: ParamId): Promise<Vehicle> {
    const vehicle = db
      .select()
      .from(vehiclesTable)
      .where(and(
        isNull(vehiclesTable.deletedAt),
        eq(vehiclesTable.id, Number(param.id))
      ))
      .get()

    if (!vehicle) {
      throw new NotFoundException('kendaraan')
    }

    return vehicle
  }

  static async create(request: VehicleRequest): Promise<void> {
    const createdAt = dayjs().unix();
    await db
      .insert(vehiclesTable)
      .values({
        ...request,
        createdAt,
      })
  }

  static async update(param: ParamId, request: VehicleRequest): Promise<void> {
    const updatedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingVehicleId = await this.checkRecord(param);

      await transaction
        .update(vehiclesTable)
        .set({
          ...request,
          updatedAt,
        })
        .where(eq(vehiclesTable.id, existingVehicleId))
    })
  }

  static async delete(param: ParamId) {
    const deletedAt = dayjs().unix()

    await db.transaction(async (transaction) => {
      const existingVehicleId = await this.checkRecord(param);

      await transaction
        .update(vehiclesTable)
        .set({
          deletedAt
        })
        .where(eq(vehiclesTable.id, existingVehicleId))
    })
  }

  static async checkRecord(param: ParamId) {
    const category = db
      .select({ id: vehiclesTable.id })
      .from(vehiclesTable)
      .where(and(
        eq(vehiclesTable.id, Number(param.id)),
        isNull(vehiclesTable.deletedAt)
      ))
      .get();


    if (!category) {
      throw new NotFoundException(messages.errorNotFound('kategori'))
    }

    return category.id
  }
}
import { MESSAGES } from '@/lib/constants/MESSAGES';
import { db } from 'db';
import { vehicles } from 'db/schema/vehicles';
import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { ParamId } from '@/schemas/ParamIdSchema';
import { VehicleRequest } from '@/schemas/vehicles/VehicleRequestSchema';
import { Vehicle } from '@/schemas/vehicles/VehicleSchema';
import dayjs from 'dayjs';
import { and, eq, isNull } from 'drizzle-orm';

export abstract class VehicleService {
  static async getList(): Promise<Array<Vehicle>> {
    const _vehicles = db
      .select()
      .from(vehicles)
      .where(isNull(vehicles.deletedAt))
      .all()

    return _vehicles;
  }

  static async get(param: ParamId): Promise<Vehicle> {
    const vehicle = db
      .select()
      .from(vehicles)
      .where(and(
        isNull(vehicles.deletedAt),
        eq(vehicles.id, Number(param.id))
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
      .insert(vehicles)
      .values({
        ...request,
        createdAt,
      })
  }

  static async update(param: ParamId, request: VehicleRequest): Promise<void> {
    const updatedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingVehicle = await this.get(param);

      await transaction
        .update(vehicles)
        .set({
          ...request,
          updatedAt,
        })
        .where(eq(vehicles.id, existingVehicle.id))
    })
  }

  static async delete(param: ParamId) {
    const deletedAt = dayjs().unix()

    await db.transaction(async (transaction) => {
      const existingVehicle = await this.get(param);

      await transaction
        .update(vehicles)
        .set({
          deletedAt
        })
        .where(eq(vehicles.id, existingVehicle.id))
    })
  }
}
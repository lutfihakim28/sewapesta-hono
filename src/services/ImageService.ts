import { NotFoundException } from '@/exceptions/NotFoundException';
import { ParamId } from '@/schemas/ParamIdSchema';
import { ImageFilter } from '@/schemas/images/ImageFilterSchema';
import { Image } from '@/schemas/images/ImageSchema';
import { ImageUpload } from '@/schemas/images/ImageUploadSchema';
import dayjs from 'dayjs';
import { db } from 'db';
import { imagesTable } from 'db/schema/images';
import { eq } from 'drizzle-orm';

export abstract class ImageService {
  static async getByReference(request: ImageFilter): Promise<Array<Image>> {
    const images = await db.query.imagesTable.findMany({
      columns: {
        id: true,
        path: true,
      },
      where: (table, { eq, and }) => and(
        eq(table.reference, request.reference),
        eq(table.referenceId, request.referenceId)
      )
    })

    return images;
  }

  static async upload(request: ImageUpload) {
    const createdAt = dayjs().unix();
    const formatedDate = dayjs().format('YYYYMMDD');
    const images = await Promise.all((request.images as Blob[]).map(async (image, id) => {
      const ext = image.name.split('.')[1];
      const name = `${request.reference}_${request.referenceId}_${formatedDate}_${id}.${ext}`;
      await Bun.write(`static/images/${name}`, image);
      return {
        createdAt,
        path: `http://localhost:3000/static/images/${name}`,
        reference: request.reference,
        referenceId: request.referenceId,
      };
    }))

    await db.insert(imagesTable).values(images);
  }

  static async delete(param: ParamId) {
    await db.transaction(async (transaction) => {
      const imageId = await this.checkRecord(param);

      await transaction.delete(imagesTable).where(eq(imagesTable.id, imageId))
    })
  }

  static async checkRecord(param: ParamId) {
    const image = db
      .select({ id: imagesTable.id })
      .from(imagesTable)
      .where(eq(imagesTable.id, Number(param.id)))
      .get();


    if (!image) {
      throw new NotFoundException('Gambar tidak ditemukan.')
    }

    return image.id
  }
}
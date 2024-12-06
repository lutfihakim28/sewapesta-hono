import { NotFoundException } from '@/exceptions/NotFoundException';
import { ParamId } from '@/schemas/ParamIdSchema';
import { ImageFilter } from '@/schemas/images/ImageFilterSchema';
import { Image } from '@/schemas/images/ImageSchema';
import { ImageUpload } from '@/schemas/images/ImageUploadSchema';
import dayjs from 'dayjs';
import { db } from 'db';
import { images } from 'db/schema/images';
import { eq, and } from 'drizzle-orm';
import { unlink } from "node:fs/promises";

export abstract class ImageService {
  static async getByReference(request: ImageFilter): Promise<Array<Image>> {
    const _images = await db.query.images.findMany({
      columns: {
        id: true,
        url: true,
        path: true,
      },
      where: and(
        eq(images.reference, request.reference),
        eq(images.referenceId, request.referenceId)
      )
    })

    return _images;
  }

  static async upload(request: ImageUpload) {
    const createdAt = dayjs().unix();
    const formatedDate = dayjs().format('YYYYMMDD');
    if (request.images instanceof Array) {
      const _images = await Promise.all((request.images as Blob[]).map(async (image, id) => {
        const ext = image.name.split('.')[1];
        const name = `${request.reference}_${request.referenceId}_${formatedDate}_${id}.${ext}`;
        await Bun.write(`static/images/${name}`, image);
        return {
          createdAt,
          path: `static/images/${name}`,
          url: `http://localhost:3000/static/images/${name}`,
          reference: request.reference,
          referenceId: request.referenceId,
        };
      }))

      await db.insert(images).values(_images);
      return;
    }

    const ext = (request.images as Blob).name.split('.')[1];
    const name = `${request.reference}_${request.referenceId}_${formatedDate}_0.${ext}`;
    await Bun.write(`static/images/${name}`, (request.images as Blob));

    await db.insert(images).values({
      createdAt,
      path: `static/images/${name}`,
      url: `http://localhost:3000/static/images/${name}`,
      reference: request.reference,
      referenceId: request.referenceId,
    });
  }

  static async delete(param: ParamId) {
    await db.transaction(async (transaction) => {
      const image = await this.checkRecord(param);

      await unlink(image.path);

      await transaction.delete(images).where(eq(images.id, image.id))

    })
  }

  static async checkRecord(param: ParamId) {
    const image = db
      .select({ id: images.id, path: images.path })
      .from(images)
      .where(eq(images.id, Number(param.id)))
      .get();


    if (!image) {
      throw new NotFoundException('Gambar tidak ditemukan.')
    }

    return image
  }
}
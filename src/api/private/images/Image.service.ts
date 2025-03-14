import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import dayjs from 'dayjs';
import { db } from 'db';
import { images } from 'db/schema/images';
import { eq, and } from 'drizzle-orm';
import { unlink } from "node:fs/promises";
import { Image, ImageFilter, ImageUpload } from './Image.schema';
import { ParamId } from '@/lib/schemas/ParamId.schema';
import { logger } from '@/lib/utils/logger';
import { imageColumns } from './Image.column';

export abstract class ImageService {
  static async getByReference(request: ImageFilter): Promise<Image[]> {
    const _images = await db
      .select(imageColumns)
      .from(images)
      .where(and(
        eq(images.reference, request.reference),
        eq(images.referenceId, request.referenceId)
      ))

    return _images;
  }

  static async upload(request: ImageUpload) {
    const formatedDate = dayjs().format('YYYYMMDD');

    const [latestImage] = await db
      .select({ path: images.path })
      .from(images)
      .where(and(
        eq(images.reference, request.reference),
        eq(images.referenceId, request.referenceId),
      ))
      .limit(1)

    let currentIndex = 0;

    if (latestImage) {
      const name = latestImage.path.split('/').at(-1)
      const nameIndex = name?.split('_').at(-1);
      currentIndex = Number(nameIndex || 0) + 1
    }

    const ext = (request.image as Blob).name.split('.')[1];
    const name = `${request.reference}_${request.referenceId}_${formatedDate}_${currentIndex}.${ext}`;
    await Bun.write(`static/.temp/${name}`, (request.image as Blob));
  }

  static async delete(param: ParamId) {
    await db.transaction(async (transaction) => {
      const [image] = await db
        .select({ id: images.id, path: images.path })
        .from(images)
        .where(eq(images.id, Number(param.id)))
        .limit(1);


      if (!image) {
        throw new NotFoundException('Image not found.')
      }

      await unlink(image.path);

      await transaction.delete(images).where(eq(images.id, image.id))

    })
  }

  static async save(paths: string[], request: ImageUpload) {
    async function processFile(path: string, attempt = 1): Promise<void> {
      try {
        const file = Bun.file(path);
        const newPath = path.replace('.temp', 'images');
        await Bun.write(newPath, file);

        await db.insert(images).values({
          path: newPath,
          url: `${Bun.env.APP_URL}/${newPath}`,
          reference: request.reference,
          referenceId: request.referenceId,
        });
      } catch (error) {
        if (attempt < 3) {
          const delay = attempt * 1000;
          logger.warn({
            path,
            attempt
          }, `Retrying ${path} in ${delay / 1000}s (Attempt ${attempt + 1})...`)
          await new Promise((resolve) => setTimeout(resolve, delay));
          await processFile(path, attempt + 1);
        } else {
          logger.error({
            path,
            error,
          }, `Retrying ${path} (Attempt ${attempt + 1})...`)
          throw new Error(`Failed to process ${path} after 3 attempts:`)
        }
      }
    }

    await Promise.all(paths.map((path) => processFile(path)));
  }
}
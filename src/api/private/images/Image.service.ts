import { NotFoundException } from '@/lib/exceptions/NotFoundException';
import { logger } from '@/lib/utils/logger';
import dayjs from 'dayjs';
import { db } from 'db';
import { images } from 'db/schema/images';
import { and, eq } from 'drizzle-orm';
import { unlink } from 'node:fs/promises';
import { imageColumns } from './Image.column';
import { Image, ImageFilter, ImageRequest, ImageSave, ImageUpload } from './Image.schema';

export abstract class ImageService {
  static async getByReference(request: ImageFilter): Promise<Image[]> {
    return db
      .select(imageColumns)
      .from(images)
      .where(and(
        eq(images.reference, request.reference),
        eq(images.referenceId, request.referenceId)
      ));
  }

  static async upload(request: ImageRequest): Promise<ImageUpload> {
    const [fileName, ext] = request.image.name.split('.');
    const name = `${fileName}_${dayjs().unix()}.${ext}`
    const path = `static/.temp/${name}`
    await Bun.write(path, request.image);

    return { path }
  }

  static async save(transaction: Parameters<Parameters<typeof db.transaction>[0]>[0], paths: string[], request: ImageSave) {
    async function processFile(path: string, attempt = 1): Promise<void> {
      try {
        const file = Bun.file(path);
        const name = path.split('/').at(-1)
        const _newPath = ['static/images']
        if (name) {
          _newPath.push(`${request.reference}_${request.referenceId}_${name}`)
        }
        const newPath = _newPath.join('/');
        await Bun.write(newPath, file);

        logger.debug({
          path: newPath,
          url: `${Bun.env.APP_URL}/${newPath}`,
          reference: request.reference,
          referenceId: request.referenceId,
        }, 'Image.save')

        await transaction.insert(images).values({
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

    for (let index = 0; index < paths.length; index++) {
      const path = paths[index];
      await processFile(path)
    }
  }

  static async delete(transaction: Parameters<Parameters<typeof db.transaction>[0]>[0], ids: number[]) {
    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];

      const [image] = await transaction
        .select({ id: images.id, path: images.path })
        .from(images)
        .where(eq(images.id, Number(id)))
        .limit(1);


      if (!image) {
        throw new NotFoundException('Image not found.')
      }

      await unlink(image.path);

      await transaction.delete(images).where(eq(images.id, image.id))
    }
  }
}
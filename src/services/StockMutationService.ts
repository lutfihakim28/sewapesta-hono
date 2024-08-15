import { StockMutationTypeEnum } from '@/enums/StockMutationTypeEnum';
import { BadRequestException } from '@/exceptions/BadRequestException';
import { OrderedProductRequest } from '@/schemas/orderedProducts/OrderedProductRequestSchema';
import { ParamId } from '@/schemas/ParamIdSchema';
import { StockMutationCreate } from '@/schemas/stockMutations/StockMutationCreateSchema';
import dayjs from 'dayjs';
import { db } from 'db';
import { items } from 'db/schema/items';
import { products } from 'db/schema/products';
import { productItems } from 'db/schema/productItems';
import { stockMutations } from 'db/schema/stockMutations';
import { eq, inArray } from 'drizzle-orm';

export abstract class StockMutationService {
  static async getList(param: ParamId) {
    const _stockMutations = db
      .select()
      .from(stockMutations)
      .where(eq(stockMutations.itemId, Number(param.id)))
      .all()

    const stock = _stockMutations.reduce((result, mutation) => {
      if (mutation.type === StockMutationTypeEnum.Addition) {
        return result + mutation.quantity
      }
      return result - mutation.quantity
    }, 0)

    if (stock === 0) {
      await this.delete(Number(param.id))
      return []
    }

    return _stockMutations
  }

  static async create(requests: Array<StockMutationCreate>) {
    const createdAt = dayjs().unix()
    await db.insert(stockMutations).values(requests.map((request) => ({
      ...request,
      createdAt,
    })))
  }

  static async delete(itemId: number) {
    await db.delete(stockMutations).where(eq(stockMutations.itemId, itemId))
  }

  static async checkStock(orderedProducts: Array<OrderedProductRequest>) {
    const _stockMutations = await db
      .select({
        itemId: items.id,
        itemName: items.name,
        type: stockMutations.type,
        quantity: stockMutations.quantity,
        itemQuantity: items.quantity,
        productId: products.id,
      })
      .from(stockMutations)
      .leftJoin(items, eq(items.id, stockMutations.itemId))
      .leftJoin(productItems, eq(items.id, productItems.itemId))
      .leftJoin(products, eq(products.id, productItems.productId))
      .where(inArray(products.id, orderedProducts.map((order) => order.productId)))

    const groupedMutation: typeof _stockMutations = [];
    _stockMutations.forEach((mutation) => {
      const existingMutationIndex = groupedMutation.findIndex((_mutation) => _mutation.itemId === mutation.itemId)

      if (existingMutationIndex === -1) {
        groupedMutation.push({
          ...mutation,
          quantity: mutation.quantity * (mutation.type === StockMutationTypeEnum.Reduction ? -1 : 1)
        })
        return
      }
      groupedMutation[existingMutationIndex].quantity += mutation.quantity * (mutation.type === StockMutationTypeEnum.Reduction ? -1 : 1)
    })

    groupedMutation.forEach((mutation) => {
      const orderedQuantity = orderedProducts.find((order) => order.productId === mutation.productId)?.baseQuantity || 0;

      if (mutation.itemQuantity && mutation.itemQuantity < Math.abs(mutation.quantity - orderedQuantity)) {
        throw new BadRequestException([`Kuantitas ${mutation.itemName} tidak mencukupi`])
      }
    })

    return true;
  }
}
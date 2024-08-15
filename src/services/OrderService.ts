import { OrderCreate } from '@/schemas/orders/OrderCreateSchema';
import dayjs from 'dayjs';
import { db } from 'db';
import { orderedProducts } from 'db/schema/orderedProducts';
import { orders } from 'db/schema/orders';
import { and, asc, between, count, desc, eq, inArray, isNull, like, or, sql } from 'drizzle-orm';
import { ItemService } from './ItemService';
import { StockMutationCreate } from '@/schemas/stockMutations/StockMutationCreateSchema';
import { StockMutationTypeEnum } from '@/enums/StockMutationTypeEnum';
import { StockMutationService } from './StockMutationService';
import { ParamId } from '@/schemas/ParamIdSchema';
import { OrderUpdate } from '@/schemas/orders/OrderUpdateSchema';
import { stockMutations } from 'db/schema/stockMutations';
import { productEmployeeAssignments } from 'db/schema/productEmployeeAssignments';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { messages } from '@/constatnts/messages';
import { OrderColumn, OrderFilter } from '@/schemas/orders/OrderFilterSchema';
import { Order } from '@/schemas/orders/OrderSchema';
import { BadRequestException } from '@/exceptions/BadRequestException';
import { countOffset } from '@/utils/countOffset';
import { OrderStatusEnum } from '@/enums/OrderStatusEnum';
import { OrderedProduct } from '@/schemas/orderedProducts/OrderedProductSchema';
import { AssignedEmployee } from '@/schemas/productEmployeeAssignments/AssignedEmployeeSchema';
import { OrderPatch } from '@/schemas/orders/OrderPatchSchema';

export abstract class OrderService {
  static async getList(query: OrderFilter): Promise<Array<Order>> {
    let sort: 'asc' | 'desc' = 'asc';
    let sortBy: OrderColumn = 'id';
    let dateRange: Array<number> = [];

    if (query.sort) {
      sort = query.sort
    }

    if (query.sortBy) {
      sortBy = query.sortBy
    }

    if (query.startAt) {
      if (!query.endAt) {
        throw new BadRequestException(['Filter tanggal akhir harus diisi.'])
      }
      dateRange.push(
        dayjs(query.startAt).startOf('day').unix(),
        dayjs(query.endAt).endOf('day').unix()
      )
    }

    const _orders = db
      .select()
      .from(orders)
      .where(and(
        isNull(orders.deletedAt),
        query.keyword
          ? or(
            like(orders.customerName, `%${query.keyword}%`),
            like(orders.customerPhone, `%${query.keyword}%`),
            like(orders.number, `%${query.keyword}%`),
          )
          : undefined,
        query.status
          ? inArray(orders.status, query.status.split('-') as Array<OrderStatusEnum>)
          : undefined,
        dateRange.length
          ? between(orders.startDate, dateRange[0], dateRange[1])
          : undefined
      ))
      .orderBy(sort === 'asc'
        ? asc(orders[sortBy])
        : desc(orders[sortBy])
      )
      .limit(Number(query.pageSize || 5))
      .offset(countOffset(query.page, query.pageSize))
      .all()

    return _orders;
  }

  static async get(param: ParamId) {
    const order = db
      .select()
      .from(orders)
      .where(eq(orders.id, Number(param.id)))
      .get();

    if (!order) {
      throw new NotFoundException(messages.errorNotFound('pesanan'))
    }

    return order;
  }

  static async create(request: OrderCreate) {
    await StockMutationService.checkStock(request.orderedProducts);
    const createdAt = dayjs().unix();
    const _order = await db.transaction(async (transaction) => {
      const number = await this.generateNumber();
      const order = await transaction
        .insert(orders)
        .values({
          ...request,
          number,
          createdAt,
        })
        .returning({
          id: orders.id,
          number: orders.number,
        })

      await Promise.all(request.orderedProducts.map(async (_product) => {
        const orderedProduct = await transaction
          .insert(orderedProducts)
          .values({
            ..._product,
            orderId: order[0].id,
          })
          .returning({ id: orderedProducts.id })

        return await transaction
          .insert(productEmployeeAssignments)
          .values(_product.employees.map((employeeId) => ({
            orderedProductId: orderedProduct[0].id,
            employeeId,
          })))
      }))

      const productIds = request.orderedProducts.map((_order) => _order.productId)

      const _items = await ItemService.getItemsByProducts(productIds)

      const mutations: Array<StockMutationCreate> = _items.map((item) => {
        const quantity = request.orderedProducts.find((_order) => _order.productId === item.productId)?.baseQuantity || 0;
        return {
          itemId: item.id,
          note: 'Dipesan',
          type: StockMutationTypeEnum.Reduction,
          orderId: order[0].id,
          quantity,
        }
      })

      await StockMutationService.create(mutations)

      return order;
    })

    return _order;
  }

  static async update(param: ParamId, request: OrderUpdate) {
    const updatedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      await this.get(param)
      await transaction
        .delete(stockMutations)
        .where(eq(stockMutations.orderId, Number(param.id)))

      await StockMutationService.checkStock(request.orderedProducts);

      const deletedOrderedProducts = await transaction
        .delete(orderedProducts)
        .where(eq(orderedProducts.orderId, Number(param.id)))
        .returning({ id: orderedProducts.id })

      await transaction
        .delete(productEmployeeAssignments)
        .where(inArray(productEmployeeAssignments.orderedProductId, deletedOrderedProducts.map((data) => data.id)))

      await transaction
        .update(orders)
        .set({
          ...request,
          updatedAt,
        })
        .where(eq(orders.id, Number(param.id)))

      await Promise.all(request.orderedProducts.map(async (_product) => {
        const orderedProduct = await transaction
          .insert(orderedProducts)
          .values({
            ..._product,
            orderId: Number(param.id),
          })
          .returning({ id: orderedProducts.id })

        return await transaction
          .insert(productEmployeeAssignments)
          .values(_product.employees.map((employeeId) => ({
            orderedProductId: orderedProduct[0].id,
            employeeId,
          })))
      }))

      const productIds = request.orderedProducts.map((_order) => _order.productId)

      const _items = await ItemService.getItemsByProducts(productIds)

      const mutations: Array<StockMutationCreate> = _items.map((item) => {
        const quantity = request.orderedProducts.find((_order) => _order.productId === item.productId)?.baseQuantity || 0;
        return {
          itemId: item.id,
          note: 'Dipesan',
          type: StockMutationTypeEnum.Reduction,
          orderId: Number(param.id),
          quantity,
        }
      })

      await StockMutationService.create(mutations)
    })
  }

  static async getOrderedProducts(param: ParamId): Promise<Array<OrderedProduct>> {
    const _orderedProducts = await db.query.orderedProducts.findMany({
      columns: {
        id: true,
        baseQuantity: true,
        orderedQuantity: true,
        price: true,
      },
      where: and(
        isNull(orderedProducts.deletedAt),
        eq(orderedProducts.orderId, Number(param.id))
      ),
      with: {
        assignedEmployees: {
          columns: {
            id: true,
          },
          with: {
            employee: {
              columns: {
                id: true,
                name: true,
                phone: true,
              }
            }
          }
        },
        orderedUnit: {
          columns: {
            id: true,
            name: true,
          }
        },
        product: {
          columns: {
            id: true,
            code: true,
            createdAt: true,
            name: true,
            price: true,
            overtimeRatio: true,
          },
          with: {
            productItems: {
              columns: {
                id: true,
                price: true,
              },
              with: {
                item: {
                  columns: {
                    id: true,
                    code: true,
                    name: true,
                  },
                  with: {
                    category: {
                      columns: {
                        id: true,
                        name: true,
                      }
                    },
                    owner: {
                      columns: {
                        id: true,
                        name: true,
                        phone: true,
                        type: true,
                      }
                    },
                  }
                }
              }
            }
          }
        }
      }
    })

    return _orderedProducts
  }

  static async getAssignedEmployees(param: ParamId): Promise<Array<AssignedEmployee>> {
    const employees: Array<AssignedEmployee> = db.all(sql`
      SELECT
        employees.id,
        employees.name,
        employees.phone,
        json_group_array(json_object(
          'id', products.id,
          'name', products.name,
          'code', products.code
        )) AS 'products'
      FROM employees
      LEFT JOIN product_employee_assignments ON product_employee_assignments.employee_id = employees.id
      LEFT JOIN ordered_products ON ordered_products.id = product_employee_assignments.ordered_product_id
      LEFT JOIN products ON products.id = ordered_products.product_id
      LEFT JOIN orders ON orders.id = ordered_products.order_id
      WHERE orders.id = ${Number(param.id)}
      GROUP BY employees.id
      `)

    return employees.map((employee) => ({
      ...employee,
      products: JSON.parse(employee.products as unknown as string)
    }))
  }

  static async patch(param: ParamId, request: OrderPatch) {
    const updatedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      const existingOrder = await this.get(param);

      if (existingOrder.status === OrderStatusEnum.Done && request.status) {
        throw new BadRequestException(['Pesanan ini sudah selesai.'])
      }

      if (existingOrder.status === OrderStatusEnum.Cancel && request.status && request.status !== OrderStatusEnum.Created) {
        throw new BadRequestException(["Status pesanan yang sudah dibatalkan hanya bisa diubah ke 'Dibuat'."])
      }

      await transaction
        .update(orders)
        .set({
          ...request,
          updatedAt,
        })
        .where(eq(orders.id, Number(param.id)));

      if (existingOrder.status === OrderStatusEnum.Cancel && request.status === OrderStatusEnum.Created) {
        const _orderedProducts = transaction
          .select({
            id: orderedProducts.id,
            quantity: orderedProducts.baseQuantity,
            productId: orderedProducts.productId
          })
          .from(orderedProducts)
          .where(eq(orderedProducts.orderId, Number(param.id)))
          .all();

        const _items = await ItemService.getItemsByProducts(_orderedProducts.map((product) => product.productId))
        const mutations: Array<StockMutationCreate> = _items.map((item) => {
          const quantity = _orderedProducts.find((_order) => _order.productId === item.productId)?.quantity || 0;
          return {
            itemId: item.id,
            note: 'Dipeasn',
            type: StockMutationTypeEnum.Reduction,
            orderId: Number(param.id),
            quantity,
          }
        })

        await StockMutationService.create(mutations)
        return
      }

      if (request.status && [OrderStatusEnum.Cancel, OrderStatusEnum.Done].includes(request.status)) {
        const _orderedProducts = transaction
          .select({
            id: orderedProducts.id,
            quantity: orderedProducts.baseQuantity,
            productId: orderedProducts.productId
          })
          .from(orderedProducts)
          .where(eq(orderedProducts.orderId, Number(param.id)))
          .all();

        const _items = await ItemService.getItemsByProducts(_orderedProducts.map((product) => product.productId))
        const mutations: Array<StockMutationCreate> = _items.map((item) => {
          const quantity = _orderedProducts.find((_order) => _order.productId === item.productId)?.quantity || 0;
          return {
            itemId: item.id,
            note: request.status === OrderStatusEnum.Cancel ? 'Dibatalkan' : 'Pesanan Selesai',
            type: StockMutationTypeEnum.Addition,
            orderId: Number(param.id),
            quantity,
          }
        })

        await StockMutationService.create(mutations)
      }
    })
  }

  static async delete(param: ParamId) {
    const deletedAt = dayjs().unix();
    await db.transaction(async (transaction) => {
      await this.get(param)
      await transaction
        .update(orders)
        .set({
          deletedAt
        })
        .where(eq(orders.id, Number(param.id)))

      const deletedOrderedProducts = await transaction
        .update(orderedProducts)
        .set({
          deletedAt
        })
        .where(eq(orderedProducts.orderId, Number(param.id)))
        .returning({
          id: orderedProducts.id
        })

      await transaction
        .update(productEmployeeAssignments)
        .set({
          deletedAt,
        })
        .where(inArray(productEmployeeAssignments.orderedProductId, deletedOrderedProducts.map((data) => data.id)))

      await transaction
        .delete(stockMutations)
        .where(eq(stockMutations.orderId, Number(param.id)))
    })
  }

  static async count(query: OrderFilter): Promise<number> {
    let dateRange: Array<number> = [];

    if (query.startAt) {
      if (!query.endAt) {
        throw new BadRequestException(['Filter tanggal akhir harus diisi.'])
      }
      dateRange.push(
        dayjs(query.startAt).startOf('day').unix(),
        dayjs(query.endAt).endOf('day').unix()
      )
    }
    const item = db
      .select({ count: count() })
      .from(orders)
      .where(and(
        isNull(orders.deletedAt),
        query.keyword
          ? or(
            like(orders.customerName, `%${query.keyword}%`),
            like(orders.customerPhone, `%${query.keyword}%`),
            like(orders.number, `%${query.keyword}%`),
          )
          : undefined,
        query.status
          ? inArray(orders.status, query.status.split('-') as Array<OrderStatusEnum>)
          : undefined,
        dateRange.length
          ? between(orders.startDate, dateRange[0], dateRange[1])
          : undefined
      ))
      .get();

    return item ? item.count : 0;
  }

  static async generateNumber() {
    const now = dayjs().format('YYYYMM');
    const lastOrder = await db.query.orders.findFirst({
      columns: {
        number: true,
      },
      where: and(
        isNull(orders.deletedAt),
        like(orders.number, `%${now}%`),
      ),
      orderBy: desc(orders.id)
    })

    if (lastOrder) {
      const lastIteration = Number(lastOrder.number.split('/')[2]);
      const currentIteration = lastIteration + 1;

      return `ORDER/${now}/${currentIteration.toString().padStart(3, '0')}`
    }

    return `ORDER/${now}/001`
  }
}